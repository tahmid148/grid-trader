import ccxt
import config
import time
import sys
import websocket
import json
import asyncio

# Connect to websocket server
ws = websocket.WebSocket()
ws.connect("ws://localhost:9001/")
print("Connected to websocket server")

payload = {"client_type": "backend"}
ws.send(json.dumps(payload))

# Connect to exchange
exchange = ccxt.binance(
    {
        "apiKey": config.API_KEY,
        "secret": config.SECRET_KEY,
    }
)

exchange.set_sandbox_mode(True)
print("Connected to exchange")

global POSITION_SIZE, NUM_BUY_GRID_LINES, NUM_SELL_GRID_LINES, GRID_SIZE, KEEP_RUNNING
POSITION_SIZE = 0.01
NUM_BUY_GRID_LINES = 5
NUM_SELL_GRID_LINES = 5
GRID_SIZE = 0.5
KEEP_RUNNING = False


async def handle_messages():
    global POSITION_SIZE, NUM_BUY_GRID_LINES, NUM_SELL_GRID_LINES, GRID_SIZE, KEEP_RUNNING
    while True:
        message = json.loads(await receive_message(ws))
        print("Received message:", message)
        if message["msg"] == "gridbot" and message["action"] == "start":
            KEEP_RUNNING = True
            print("Starting bot...")
            disable_start_button = {"dashboard_update": "true"}
            ws.send(json.dumps(disable_start_button))
        elif message["msg"] == "gridbot" and message["action"] == "stop":
            KEEP_RUNNING = False
            print("Stopping bot.")
            enable_start_button = {"dashboard_update": "false"}
            ws.send(json.dumps(enable_start_button))
        elif message["msg"] == "settings":
            POSITION_SIZE = message["position_size"]
            NUM_BUY_GRID_LINES = message["number_of_grid_lines"]
            NUM_SELL_GRID_LINES = message["number_of_grid_lines"]
            GRID_SIZE = message["grid_size"]
            print("Updated settings.")


async def start_bot():
    global POSITION_SIZE, NUM_BUY_GRID_LINES, NUM_SELL_GRID_LINES, GRID_SIZE, KEEP_RUNNING
    while True:
        if KEEP_RUNNING:
            # Fetch current bid and ask prices
            ticker = exchange.fetch_ticker(config.SYMBOL)

            buy_orders = []
            sell_orders = []
            total_profit = [{"total_profit": 0}]

            for i in range(NUM_BUY_GRID_LINES):
                initial_price = ticker["bid"]
                order_price = initial_price - ((i + 1) * GRID_SIZE)
                print(
                    "Submitting market limit buy order for "
                    + str(POSITION_SIZE)
                    + " at "
                    + str(order_price)
                )
                order = exchange.create_limit_buy_order(
                    config.SYMBOL, POSITION_SIZE, order_price
                )
                buy_orders.append(order["info"])

            for i in range(NUM_SELL_GRID_LINES):
                initial_price = ticker["bid"]
                order_price = initial_price + ((i + 1) * GRID_SIZE)
                print(
                    "Submitting market limit sell order for "
                    + str(POSITION_SIZE)
                    + " at "
                    + str(order_price)
                )
                order = exchange.create_limit_sell_order(
                    config.SYMBOL, POSITION_SIZE, order_price
                )
                sell_orders.append(order["info"])

            closed_orders = []

            while KEEP_RUNNING:
                try:
                    payload = {
                        "order_data": buy_orders + sell_orders + closed_orders,
                    }
                    ws.send(json.dumps(payload))
                except BrokenPipeError:
                    print("WebSocket connection closed unexpectedly. Reconnecting...")
                    ws.connect("ws://localhost:9001/")
                    continue

                closed_order_ids = []

                for buy_order in buy_orders:
                    print("Checking Buy Order " + str(buy_order["orderId"]))
                    try:
                        order = exchange.fetch_order(
                            buy_order["orderId"], config.SYMBOL
                        )
                    except Exception as e:
                        print("Request Failed, Retrying...")
                        continue

                    order_info = order["info"]
                    order_status = order_info["status"]

                    if order_status == config.CLOSED_ORDER_STATUS:
                        closed_order_ids.append(order_info["orderId"])
                        closed_orders.append(order_info)
                        print("Buy Order Executed at " +
                              str(order_info["price"]))
                        buy_price = float(order_info["price"]) * POSITION_SIZE
                        total_profit[0]["total_profit"] -= buy_price
                        new_sell_price = float(order_info["price"]) + GRID_SIZE
                        print("Creating New Limit Sell Order at " +
                              str(new_sell_price))
                        new_sell_order = exchange.create_limit_sell_order(
                            config.SYMBOL, POSITION_SIZE, new_sell_price
                        )
                        sell_orders.append(new_sell_order["info"])

                    time.sleep(config.CHECK_ORDERS_FREQUENCY)

                for sell_order in sell_orders:
                    print("Checking Sell Order " + str(sell_order["orderId"]))
                    try:
                        order = exchange.fetch_order(
                            sell_order["orderId"], config.SYMBOL
                        )
                    except Exception as e:
                        print("Request Failed, Retrying...")
                        continue

                    order_info = order["info"]
                    order_status = order_info["status"]

                    if order_status == config.CLOSED_ORDER_STATUS:
                        closed_order_ids.append(order_info["orderId"])
                        closed_orders.append(order_info)
                        print("Sell Order Executed at " +
                              str(order_info["price"]))
                        sell_price = float(order_info["price"]) * POSITION_SIZE
                        total_profit[0]["total_profit"] += sell_price
                        new_buy_price = float(order_info["price"]) - GRID_SIZE
                        print("Creating New Limit Buy Order at " +
                              str(new_buy_price))
                        new_buy_order = exchange.create_limit_buy_order(
                            config.SYMBOL, POSITION_SIZE, new_buy_price
                        )
                        buy_orders.append(new_buy_order["info"])
                    time.sleep(config.CHECK_ORDERS_FREQUENCY)

                for closed_order_id in closed_order_ids:
                    buy_orders = [
                        buy_order
                        for buy_order in buy_orders
                        if buy_order["orderId"] != closed_order_id
                    ]
                    sell_orders = [
                        sell_order
                        for sell_order in sell_orders
                        if sell_order["orderId"] != closed_order_id
                    ]

                print("Profit: " + str(total_profit))

                if len(sell_orders) == 0:
                    print("All sell orders have been closed, stopping bot!")
                    KEEP_RUNNING = False

                await asyncio.sleep(1)
        else:
            await asyncio.sleep(1)


async def receive_message(ws):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, ws.recv)


async def main():
    await asyncio.gather(handle_messages(), start_bot())


asyncio.run(main())
