import psycopg2
from sshtunnel import SSHTunnelForwarder
from dotenv import load_dotenv
import os
import random
from datetime import datetime, timedelta

# Load environment variables from .env file
load_dotenv()

# Get variables from environment
SSH_HOST = os.getenv('SSH_HOST')
SSH_PORT = int(os.getenv('SSH_PORT'))
SSH_USER = os.getenv('SSH_USER')
SSH_PASSWORD = os.getenv('SSH_PASSWORD')

POSTGRES_HOST = os.getenv('POSTGRES_HOST')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_PORT = int(os.getenv('POSTGRES_PORT'))

# Connect to PostgreSQL database via SSH tunnel
tunnel = SSHTunnelForwarder(
    (SSH_HOST, SSH_PORT),
    ssh_username=SSH_USER,
    ssh_password=SSH_PASSWORD,
    remote_bind_address=(POSTGRES_HOST, POSTGRES_PORT),
    local_bind_address=('127.0.0.1', 5433)
)
tunnel.start()

connection = psycopg2.connect(
    database=POSTGRES_DB,
    user=POSTGRES_USER,
    password=POSTGRES_PASSWORD,
    host='127.0.0.1',
    port=tunnel.local_bind_port
)

cursor = connection.cursor()

# Start: define function to assign random datetimes to comments from now until chosen end date
def generate_random_datetime():
    start_date = datetime.now()
    end_date = datetime(2024, 9, 30, 23, 59, 59) #! Need to change for end date of the project
    random_date = start_date + (end_date - start_date) * random.random()
    hour = random.randint(18, 23) if random.random() < 0.5 else random.randint(0, 6)
    random_date = random_date.replace(hour=hour, minute=random.randint(0, 59), second=random.randint(0, 59))
    return random_date
# End function to assign comments with random datetimes

# Update dummy_comments with random datetimes
cursor.execute("SELECT id FROM comments_fs3")
comment_ids = cursor.fetchall()

update_sql = """
UPDATE comments_fs3
SET created_at = %s
WHERE id = %s
"""

for comment_id in comment_ids:
    random_datetime = generate_random_datetime()
    cursor.execute(update_sql, (random_datetime, comment_id[0]))

connection.commit()

# Create the new table matching official comments table
create_table_sql = """
CREATE TABLE IF NOT EXISTS dummy_comments3 (
    id SERIAL PRIMARY KEY,
    parent_id INT DEFAULT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    text TEXT NOT NULL,
    location geometry(Point, 4326) NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    tags TEXT[] DEFAULT '{}'
);
"""

cursor.execute("DROP TABLE IF EXISTS dummy_comments3;")
connection.commit()

# Create new table
cursor.execute(create_table_sql)
connection.commit()

# Copy relevant data from comments_fs to dummy_comments
copy_data_sql = """
INSERT INTO dummy_comments3 (parent_id, timestamp, text, location, likes, dislikes, tags)
SELECT parent_id, created_at, comment, geom, likes, dislikes, 
    CASE 
        WHEN tags = '{}' THEN '{}'
        ELSE
            -- Convert comma-separated tags to array and handle extra quotes
            REPLACE(
                REPLACE(
                    REPLACE(tags, '""', '"'), 
                    '{', '{' 
                ), 
                '}', '}'
            )::TEXT[]
    END
FROM comments_fs3;
"""

cursor.execute(copy_data_sql)
connection.commit()

cursor.close()
connection.close()
tunnel.stop()
