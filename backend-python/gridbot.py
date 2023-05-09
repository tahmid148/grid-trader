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
    buy_orders.append(order['info'])

for i in range(config.NUM_SELL_GRID_LINES):
    initial_price = ticker['bid'] + (i * config.GRID_SIZE)
    order_price = initial_price + (i * config.GRID_SIZE) # Order should be the above and dependant on size of the grid
    print("Submitting market limit sell order for " + str(config.POSITION_SIZE) + " at " + str(order_price))
    order = exchange.create_limit_sell_order(config.SYMBOL, config.POSITION_SIZE, order_price)
    sell_orders.append(order['info'])

while True:
    closed_order_ids = []
    for buy_order in buy_orders:
        print("Checking buy orders for " + str(buy_order['orderId']))
        try:
            order = exchange.fetch_order(buy_order['orderId'], config.SYMBOL)
            # print(order)
        except Exception as e:
            print("Request Failed, Retrying...")
            continue

        order_info = order['info']

        if order_info == config.CLOSED_ORDER_STATUS:
            # Remove the closed Buy Order
            closed_order_ids.append(order_info['orderId'])
            print("Buy Order Executed at " + str(order_info['price']))
            # Create Sell Order
            new_sell_price = order_info['price'] + config.GRID_SIZE
            print("Creating New Limit Sell Order at " + str(new_sell_price)) 
            new_sell_order = exchange.create_limit_sell_order(config.SYMBOL, config.POSITION_SIZE, new_sell_price)
            sell_orders.append(new_sell_order)
             
        time.sleep(config.CHECK_ORDERS_FREQUENCY)

    print("Checking for open sell orders:")
    for sell_order in sell_orders:
        print("Checking Sell Orders for " + str(sell_order['orderId']))
        try:
            order = exchange.fetch_order(sell_order['orderId'], config.SYMBOL)
            # print(order)
        except Exception as e:
            print("Request Failed, Retrying...")
            continue

        order_info = order['info']

        if order_info == config.CLOSED_ORDER_STATUS:
            # Remove the closed sell Order
            closed_order_ids.append(order_info['orderId'])
            print("Buy Sell Executed at " + str(order_info['price']))
            # Create Buy Order
            new_buy_price = order_info['price'] - config.GRID_SIZE
            print("Creating New Limit Sell Order at " + str(new_buy_price)) 
            new_buy_order = exchange.create_limit_buy_order(config.SYMBOL, config.POSITION_SIZE, new_buy_price)
            buy_orders.append(new_buy_order)
             
        time.sleep(config.CHECK_ORDERS_FREQUENCY)

    for order_id in closed_order_ids:
        buy_orders = [buy_order for buy_order in buy_orders if buy_order['orderId'] != order_id]
        sell_orders = [sell_order for sell_order in sell_orders if sell_order['orderId'] != order_id]
    
    if (sell_orders ==0):
        sys.exit("Stopping bot, nothing left to sell")