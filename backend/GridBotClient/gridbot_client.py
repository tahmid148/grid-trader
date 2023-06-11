import ccxt
import config
import time
import sys
import websocket
import json
import asyncio
from order import Order

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
NUM_BUY_GRID_LINES = 2
NUM_SELL_GRID_LINES = 2
GRID_SIZE = 0.1
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
            payload = {"order_data": []}
            ws.send(json.dumps(payload))
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

            orders = []
            buy_orders = []
            sell_orders = []
            total_profit = [{"total_profit": 0}]
            id = 0

            # Create initial buy and sell orders
            for i in range(NUM_BUY_GRID_LINES):
                initial_price = ticker["bid"]
                order_buy_price = initial_price - ((i + 1) * GRID_SIZE)
                order_sell_price = initial_price + ((i + 1) * GRID_SIZE)
                print(
                    f"Submitting market limit buy order for {POSITION_SIZE} at {order_buy_price}"
                )
                buy_order = exchange.create_limit_buy_order(
                    config.SYMBOL, POSITION_SIZE, order_buy_price
                )
                print(
                    f"Submitting market limit sell order for {POSITION_SIZE} at {order_sell_price}"
                )
                sell_order = exchange.create_limit_sell_order(
                    config.SYMBOL, POSITION_SIZE, order_sell_price
                )

                # The Buy orders do not have a corresponding sell order until they are executed
                orders.append(Order(buy_order, None, id))
                id += 1
                # The Sell orders have a corresponding buy order which is created when the bot is
                # started; this buy order is placed at the starting price and the quantity will be
                # based on the bot settings (position size * number of grid lines)
                initial_investment_buy = exchange.create_order(
                    config.SYMBOL, "market", "buy", POSITION_SIZE
                )
                orders.append(Order(initial_investment_buy, sell_order, id))
                id += 1

            closed_orders = []

            while KEEP_RUNNING:
                orders_json = [order.to_dict() for order in orders]
                closed_orders_json = [order.to_dict()
                                      for order in closed_orders]
                payload = {"order_data": orders_json + closed_orders_json}
                ws.send(json.dumps(payload))

                # TODO: Deal with closed orders

                for order in orders:
                    buy_order = order.buy_order
                    sell_order = order.sell_order
                    order_id = order.id
                    if buy_order and not order.is_buy_order_closed():
                        print(
                            f"{order_id} : Checking Buy Order {buy_order['orderId']}")
                        try:
                            exchange_order = exchange.fetch_order(
                                buy_order["orderId"], config.SYMBOL
                            )
                            order.set_buy_order(exchange_order)
                        except Exception as e:
                            print(f"Request Failed, Retrying... {e}")
                            continue
                        order_info = exchange_order["info"]
                        order_status = order_info["status"]
                        if order_status == config.CLOSED_ORDER_STATUS and not order.has_sell_order():
                            print(
                                f"{order_id} : Buy Order {buy_order['orderId']} Executed at {order_info['price']}"
                            )
                            new_sell_price = float(
                                order_info["price"]) + GRID_SIZE
                            print(
                                f"{order_id} : Creating New Limit Sell Order at {new_sell_price}")
                            new_sell_order = exchange.create_limit_sell_order(
                                config.SYMBOL, POSITION_SIZE, new_sell_price
                            )
                            order.set_sell_order(new_sell_order)
                            time.sleep(config.CHECK_ORDERS_FREQUENCY)
                    if sell_order and not order.is_sell_order_closed():
                        print(
                            f"{order_id} : Checking Sell Order {sell_order['orderId']}")
                        try:
                            exchange_order = exchange.fetch_order(
                                sell_order["orderId"], config.SYMBOL
                            )
                            order.set_sell_order(exchange_order)
                        except Exception as e:
                            print(f"Request Failed, Retrying... {e}")
                            continue
                        order_info = exchange_order["info"]
                        order_status = order_info["status"]
                        if order_status == config.CLOSED_ORDER_STATUS:
                            print(
                                f"{order_id} : Sell Order {sell_order['orderId']} Executed at {order_info['price']}"
                            )
                            new_buy_price = float(
                                order_info["price"]) - GRID_SIZE
                            print(
                                f"{order_id} : Creating New Limit Buy Order at {new_buy_price}")
                            new_buy_order = exchange.create_limit_buy_order(
                                config.SYMBOL, POSITION_SIZE, new_buy_price
                            )
                            orders.append(Order(new_buy_order, None, id))
                            id += 1
                            time.sleep(config.CHECK_ORDERS_FREQUENCY)
                    if order.is_closed():
                        closed_orders.append(order)

                # Remove closed orders from orders list
                orders = [
                    order for order in orders if order not in closed_orders]

                if get_number_of_sell_orders(orders) == 0:
                    print("All sell orders have been closed, stopping bot!")
                    orders_json = [order.to_dict() for order in orders]
                    closed_orders_json = [order.to_dict()
                                          for order in closed_orders]
                    payload = {"order_data": orders_json + closed_orders_json}
                    ws.send(json.dumps(payload))
                    enable_start_button = {"dashboard_update": "false"}
                    turn_off_price_lines = {"chart_update": "true"}
                    ws.send(json.dumps(enable_start_button))
                    ws.send(json.dumps(turn_off_price_lines))
                    KEEP_RUNNING = False

                await asyncio.sleep(1)
        else:
            await asyncio.sleep(1)


async def receive_message(ws):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, ws.recv)


async def main():
    await asyncio.gather(handle_messages(), start_bot())


def get_number_of_sell_orders(orders):
    count = 0
    for order in orders:
        if order.has_sell_order() and not order.is_sell_order_closed():
            count += 1
    return count


asyncio.run(main())
