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
# initial_buy_order = exchange.create_market_buy_order(config.SYMBOL, 0.01)

for i in range(config.NUM_BUY_GRID_LINES):
    initial_price = ticker['bid']
    order_price = initial_price - (i * config.GRID_SIZE) # Order should be the below and dependant on size of the grid
    print("Submitting market limit buy order for " + str(config.POSITION_SIZE) + " at " + str(order_price))
    order = exchange.create_limit_buy_order(config.SYMBOL, config.POSITION_SIZE, order_price)
    buy_orders.append(order)

for i in range(config.NUM_SELL_GRID_LINES):
    initial_price = ticker['bid'] + (i * config.GRID_SIZE)
    order_price = initial_price + (i * config.GRID_SIZE) # Order should be the above and dependant on size of the grid
    print("Submitting market limit sell order for " + str(config.POSITION_SIZE) + " at " + str(order_price))
    order = exchange.create_limit_sell_order(config.SYMBOL, config.POSITION_SIZE, order_price)
    sell_orders.append(order)

# Check orders
for order in buy_orders:
    print(order['info'])