import json
import psycopg2
import requests
import time
import datetime
import pytz 
from sshtunnel import SSHTunnelForwarder
from dotenv import load_dotenv
import os
import random

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

# Need to add new columns to existing comments_fs table
alter_table_sql = """
ALTER TABLE comments_fs
ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326),
ADD COLUMN IF NOT EXISTS parent_id INT,
ADD COLUMN IF NOT EXISTS tags TEXT,
ADD COLUMN IF NOT EXISTS likes INT,
ADD COLUMN IF NOT EXISTS dislikes INT;
"""
cursor.execute(alter_table_sql)
connection.commit()

# Combine longitude and latitude into a geolocation point to match format of the comments table
update_geom_sql = """
UPDATE comments_fs
SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE geom IS NULL;
"""
cursor.execute(update_geom_sql)
connection.commit()

# Add default values to parent_id column, tags column, and likes/dislikes columns
update_defaults_sql = """
UPDATE comments_fs
SET parent_id = NULL,
    tags = COALESCE(tags, '{}'),
    likes = COALESCE(likes, 0),
    dislikes = COALESCE(dislikes, 0)
WHERE parent_id = 0;
"""
cursor.execute(update_defaults_sql)
connection.commit()

# # Start: define function to commit values to comments_fs table
# def comments_to_db(name, address, comment, created_at, latitude, longitude, parent_id=0, tags='{}', likes=0, dislikes=0):
#     # Convert created_at to datetime matching comments table
#     if created_at is not None:
#         created_at = datetime.datetime.strptime(created_at, '%Y-%m-%dT%H:%M:%S.%fZ')

#     geom = f"SRID=4326;POINT({longitude} {latitude})"
#     vals = (name, address, comment, created_at, latitude, longitude, geom, parent_id, tags, likes, dislikes)
#     cursor.execute("""
#         INSERT INTO comments_fs (name, address, comment, created_at, latitude, longitude, geom, parent_id, tags, likes, dislikes) 
#         VALUES (%s, %s, %s, %s, %s, %s, ST_GeomFromText(%s), %s, %s, %s, %s)
#     """, vals)
#     connection.commit()
# # End: function committing values to comments_fs table


# Close the cursor and connection
cursor.close()
connection.close()
tunnel.stop()
