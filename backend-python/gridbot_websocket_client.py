import ccxt
import config
import time
import sys
import websocket
import json

# Connect to websocket server
ws = websocket.WebSocket()
ws.connect("ws://localhost:9001")

# Connect to exchange
exchange = ccxt.binance({
    'apiKey': config.API_KEY,
    'secret': config.SECRET_KEY,
})

exchange.set_sandbox_mode(True)

# Fetch current bid and ask prices
ticker = exchange.fetch_ticker(config.SYMBOL)
# print(ticker)

buy_orders = []
sell_orders = []

# Print initial buy order
# initial_buy_order = exchange.create_market_buy_order(config.SYMBOL, 0.01)
# print(initial_buy_order)

for i in range(config.NUM_BUY_GRID_LINES):
    initial_price = ticker['bid']
    # Order should be the below and dependant on size of the grid
    order_price = initial_price - ((i + 1) * config.GRID_SIZE)
    print("Submitting market limit buy order for " +
          str(config.POSITION_SIZE) + " at " + str(order_price))
    order = exchange.create_limit_buy_order(
        config.SYMBOL, config.POSITION_SIZE, order_price)
    buy_orders.append(order['info'])

for i in range(config.NUM_SELL_GRID_LINES):
    initial_price = ticker['bid']
    # Order should be the above and dependant on size of the grid
    order_price = initial_price + ((i + 1) * config.GRID_SIZE)
    print("Submitting market limit sell order for " +
          str(config.POSITION_SIZE) + " at " + str(order_price))
    order = exchange.create_limit_sell_order(
        config.SYMBOL, config.POSITION_SIZE, order_price)
    sell_orders.append(order['info'])


# Closed Order objects to be sent to the frontend
closed_orders = []

while True:
    # concatenate 3 order lists and send as jsonified string
    ws.send(json.dumps(buy_orders + sell_orders + closed_orders))

    closed_order_ids = []

    for buy_order in buy_orders:
        print("Checking Buy Order " + str(buy_order['orderId']))
        try:
            order = exchange.fetch_order(buy_order['orderId'], config.SYMBOL)
        except Exception as e:
            print("Request Failed, Retrying...")
            continue

        order_info = order['info']
        order_status = order_info['status']

        if order_status == config.CLOSED_ORDER_STATUS:
            closed_order_ids.append(order_info['orderId'])
            closed_orders.append(order_info)
            print("Buy Order Executed at " + str(order_info['price']))
            # Create Limit Sell Order
            new_sell_price = float(order_info['price']) + config.GRID_SIZE
            print("Creating New Limit Sell Order at " + str(new_sell_price))
            new_sell_order = exchange.create_limit_sell_order(
                config.SYMBOL, config.POSITION_SIZE, new_sell_price)
            sell_orders.append(new_sell_order['info'])

        time.sleep(config.CHECK_ORDERS_FREQUENCY)

    for sell_order in sell_orders:
        print("Checking Sell Order " + str(sell_order['orderId']))
        try:
            order = exchange.fetch_order(sell_order['orderId'], config.SYMBOL)
        except Exception as e:
            print("Request Failed, Retrying...")
            continue

        order_info = order['info']
        order_status = order_info['status']

        if order_status == config.CLOSED_ORDER_STATUS:
            closed_order_ids.append(order_info['orderId'])
            closed_orders.append(order_info)
            print("Sell Order Executed at " + str(order_info['price']))
            # Create Limit Buy Order
            new_buy_price = float(order_info['price']) - config.GRID_SIZE
            print("Creating New Limit Buy Order at " + str(new_buy_price))
            new_buy_order = exchange.create_limit_buy_order(
                config.SYMBOL, config.POSITION_SIZE, new_buy_price)
            buy_orders.append(new_buy_order['info'])

        time.sleep(config.CHECK_ORDERS_FREQUENCY)

    # Remove closed orders from buy_orders and sell_orders
    print("Removing closed orders from buy_orders and sell_orders")
    print("Buy Orders" + str(buy_orders))
    print("Sell Orders" + str(sell_orders))
    for closed_order_id in closed_order_ids:
        buy_orders = [
            buy_order for buy_order in buy_orders if buy_order['orderId'] != closed_order_id]
        sell_orders = [
            sell_order for sell_order in sell_orders if sell_order['orderId'] != closed_order_id]

    # Stop the bot if there are no more open sell orders
    if len(sell_orders) == 0:
        print("All sell orders have been closed, stopping bot!")
        sys.exit()
