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

# while KEEP_RUNNING:
#     ticker = exchange.fetch_ticker(config.SYMBOL)
#     close_price = [ticker["close"]]
#     orders_json = [order.to_dict() for order in orders]
#     try:
#         payload = {
#             "order_data": orders_json
#             + closed_orders
#             + total_profit,
#         }
#         ws.send(json.dumps(payload))
#     except BrokenPipeError:
#         print("WebSocket connection closed unexpectedly. Reconnecting...")
#         ws.connect("ws://localhost:9001/")
#         continue
#     closed_order_ids = []
#     for buy_order in buy_orders:
#         print("Checking Buy Order " + str(buy_order["orderId"]))
#         try:
#             order = exchange.fetch_order(
#                 buy_order["orderId"], config.SYMBOL
#             )
#         except Exception as e:
#             print("Request Failed, Retrying...")
#             continue
#         order_info = order["info"]
#         order_status = order_info["status"]
#         if order_status == config.CLOSED_ORDER_STATUS:
#             closed_order_ids.append(order_info["orderId"])
#             closed_orders.append(order_info)
#             print("Buy Order Executed at " +
#                   str(order_info["price"]))
#             buy_price = float(order_info["price"]) * POSITION_SIZE
#             total_profit[0]["total_profit"] -= buy_price
#             new_sell_price = float(order_info["price"]) + GRID_SIZE
#             print("Creating New Limit Sell Order at " +
#                   str(new_sell_price))
#             new_sell_order = exchange.create_limit_sell_order(
#                 config.SYMBOL, POSITION_SIZE, new_sell_price
#             )
#             sell_orders.append(new_sell_order["info"])
#         time.sleep(config.CHECK_ORDERS_FREQUENCY)
#     for sell_order in sell_orders:
#         print("Checking Sell Order " + str(sell_order["orderId"]))
#         try:
#             order = exchange.fetch_order(
#                 sell_order["orderId"], config.SYMBOL
#             )
#         except Exception as e:
#             print("Request Failed, Retrying...")
#             continue
#         order_info = order["info"]
#         order_status = order_info["status"]
#         if order_status == config.CLOSED_ORDER_STATUS:
#             closed_order_ids.append(order_info["orderId"])
#             closed_orders.append(order_info)
#             print("Sell Order Executed at " +
#                   str(order_info["price"]))
#             sell_price = float(order_info["price"]) * POSITION_SIZE
#             total_profit[0]["total_profit"] += sell_price
#             new_buy_price = float(order_info["price"]) - GRID_SIZE
#             print("Creating New Limit Buy Order at " +
#                   str(new_buy_price))
#             new_buy_order = exchange.create_limit_buy_order(
#                 config.SYMBOL, POSITION_SIZE, new_buy_price
#             )
#             buy_orders.append(new_buy_order["info"])
#         time.sleep(config.CHECK_ORDERS_FREQUENCY)
#     for closed_order_id in closed_order_ids:
#         buy_orders = [
#             buy_order
#             for buy_order in buy_orders
#             if buy_order["orderId"] != closed_order_id
#         ]
#         sell_orders = [
#             sell_order
#             for sell_order in sell_orders
#             if sell_order["orderId"] != closed_order_id
#         ]
#     print("Profit: " + str(total_profit))
#     if len(sell_orders) == 0:
#         print("All sell orders have been closed, stopping bot!")
#         KEEP_RUNNING = False
#     await asyncio.sleep(1)
