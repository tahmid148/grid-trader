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
                orders.append(Order(buy_order))
                # The Sell orders have a corresponding buy order which is created when the bot is
                # started; this buy order is placed at the starting price and the quantity will be
                # based on the bot settings (position size * number of grid lines)
                initial_investment_buy = exchange.create_order(
                    config.SYMBOL, "market", "buy", POSITION_SIZE
                )
                orders.append(Order(initial_investment_buy, sell_order))

            closed_orders = []

            while KEEP_RUNNING:

                await asyncio.sleep(1)
        else:
            await asyncio.sleep(1)


async def receive_message(ws):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, ws.recv)


async def main():
    await asyncio.gather(handle_messages(), start_bot())


asyncio.run(main())
