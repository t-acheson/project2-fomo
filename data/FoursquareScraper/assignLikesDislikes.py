# Following code is essentially the same as updateTags.py code but has been adapted to assign likes and dislikes to comments
# Separated from tag assignment as connection to postgres times out before completing assignment

import psycopg2
import random
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

# Get all comment ids
cursor.execute("SELECT id FROM comments_fs")
comment_ids = cursor.fetchall()

# Update each row with a random number of likes and dislikes between 0 and 10
for comment_id in comment_ids:
    random_likes = random.randint(0, 10)
    random_dislikes = random.randint(0, 10)
    cursor.execute(
        "UPDATE comments_fs SET likes = %s, dislikes = %s WHERE id = %s",
        (random_likes, random_dislikes, comment_id)
    )
    print(f"Comment ID {comment_id[0]}, Likes: {random_likes}, Dislikes: {random_dislikes}")


connection.commit()


cursor.close()
connection.close()
tunnel.stop()
