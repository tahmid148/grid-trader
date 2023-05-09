import ccxt, config, time, sys

# Connect to exchange
exchange = ccxt.binance({
    'apiKey': config.API_KEY,
    'secret': config.SECRET_KEY,
})

# Fetch current bid and ask prices
ticker = exchange.fetch_ticker(config.SYMBOL)

print(ticker)