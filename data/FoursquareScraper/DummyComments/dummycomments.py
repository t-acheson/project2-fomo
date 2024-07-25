import psycopg2
from sshtunnel import SSHTunnelForwarder
from dotenv import load_dotenv
import os

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

# Create the new table matching official comments table
create_table_sql = """
CREATE TABLE IF NOT EXISTS dummy_comments2 (
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

cursor.execute("DROP TABLE IF EXISTS dummy_comments2;")
connection.commit()

# Create new table
cursor.execute(create_table_sql)
connection.commit()

# Copy relevant data from comments_fs to dummy_comments
copy_data_sql = """
INSERT INTO dummy_comments2 (parent_id, timestamp, text, location, likes, dislikes, tags)
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
FROM comments_fs2;
"""

cursor.execute(copy_data_sql)
connection.commit()

cursor.close()
connection.close()
tunnel.stop()
