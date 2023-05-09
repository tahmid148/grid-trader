import os
from dotenv import load_dotenv

def get_key_from_env():
    # Load environment variables from the .env file
    load_dotenv()

    # Retrieve the key from the environment
    api_key = os.getenv('API_KEY')
    secret_key = os.getenv('SECRET_KEY')

    # Return the retrieved key
    return api_key, secret_key

API_KEY, SECRET_KEY = get_key_from_env()
SYMBOL="ETHUSDT"
POSITION_SIZE=0.001

#GridBot Settings
NUM_BUY_GRID_LINES = 5
NUM_SELL_GRID_LINES = 5
GRID_SIZE = 3

CHECK_ORDERS_FREQUENCY = 2
CLOSED_ORDER_STATUS = "closed"