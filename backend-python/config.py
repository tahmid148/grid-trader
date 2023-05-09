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
SYMBOL = os.getenv('SYMBOL')