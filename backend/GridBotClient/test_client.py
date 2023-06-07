import json
import websocket
import ccxt
import config

# Connect to exchange
exchange = ccxt.binance(
    {
        "apiKey": config.API_KEY,
        "secret": config.SECRET_KEY,
    }
)
exchange.set_sandbox_mode(True)
print("Connected to exchange")

ticker = exchange.fetch_ticker(config.SYMBOL)
print(ticker)
