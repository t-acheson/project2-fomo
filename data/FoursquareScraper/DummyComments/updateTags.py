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

# List of all possible tags for comments
possible_tags = [
    "Non-alcoholic", "FoodieFind", "HiddenGem", "Outdoor", "ChillVibes",
    "BarHopping", "GameNight", "Festival", "CommunityEvent", "Exhibit",
    "Theater", "Concert", "Crowded", "LiveMusic", "DateSpot", "OpenMic"
]

#Start: define function to get up to 3 random tags for each comment
def get_random_tags(tags_list, min_count=1, max_count=3):
    num_tags = random.randint(min_count, max_count)
    return random.sample(tags_list, num_tags)
#End function to get random tags


# Get all comment ids
cursor.execute("SELECT id FROM comments_fs WHERE tags = '{}'")
comment_ids = cursor.fetchall()

# Update rows with 1 to 3 random tags for each comment
for comment_id in comment_ids:
    random_tags = get_random_tags(possible_tags)
    cursor.execute(
        "UPDATE comments_fs SET tags = %s WHERE id = %s",
        (random_tags, comment_id)
    )
    print(f"Assigned tags {random_tags} to comment ID {comment_id[0]}")

connection.commit()

cursor.close()
connection.close()
tunnel.stop()
