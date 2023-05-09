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

# Example usage
api_key, secret_key = get_key_from_env()
print("API Key:", api_key)
print("Secret Key:", secret_key)