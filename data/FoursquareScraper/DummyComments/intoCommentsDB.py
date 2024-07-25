# Essentially the same code as dummycomments.py but now to insert dummy_comments table into the official comments table

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
    end_date = datetime(2024, 7, 30, 23, 59, 59) #! Need to change for end date of the project
    random_date = start_date + (end_date - start_date) * random.random()
    hour = random.randint(18, 23) if random.random() < 0.5 else random.randint(0, 6)
    random_date = random_date.replace(hour=hour, minute=random.randint(0, 59), second=random.randint(0, 59))
    return random_date
# End function to assign comments with random datetimes

# Update dummy_comments with random datetimes
cursor.execute("SELECT id FROM dummy_comments2")
comment_ids = cursor.fetchall()

update_sql = """
UPDATE dummy_comments2
SET timestamp = %s
WHERE id = %s
"""

for comment_id in comment_ids:
    random_datetime = generate_random_datetime()
    cursor.execute(update_sql, (random_datetime, comment_id[0]))

connection.commit()

# Copy relevant data from dummy_comments to official comments table
#! Modified to match location data to comments showing on feed
copy_data_sql = """
INSERT INTO comments (parent_id, timestamp, text, location, likes, dislikes, tags)
SELECT parent_id, timestamp, text, '0101000020E610000000000000000000400000000000000040'::geometry, likes, dislikes, tags
FROM dummy_comments2;
"""

# # Copy relevant data from comments_fs to dummy_comments
# copy_data_sql = """
# INSERT INTO comments (parent_id, timestamp, text, location, likes, dislikes, tags)
# SELECT parent_id, timestamp, text, location, likes, dislikes, tags
# FROM dummy_comments2;
# """

cursor.execute(copy_data_sql)
connection.commit()

cursor.close()
connection.close()
tunnel.stop()