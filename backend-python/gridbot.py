import ccxt, config, time, sys

# Connect to exchange
exchange = ccxt.binance({
    'apiKey': config.API_KEY,
    'secret': config.SECRET_KEY,
})

exchange.set_sandbox_mode(True)

# Fetch current bid and ask prices
ticker = exchange.fetch_ticker(config.SYMBOL)
print(ticker)

buy_orders = []
sell_orders = []

# Create market buy order
initial_buy_order = exchange.create_market_buy_order(config.SYMBOL, 0.01)
print("INITIAL BUY ORDER:")
print(initial_buy_order)
