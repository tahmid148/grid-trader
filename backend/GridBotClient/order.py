class Order:
    def __init__(self, order):
        if order["info"]["side"] == "BUY":
            self.buy_order = order["info"]
            self.sell_order = None
        elif order["info"]["side"] == "SELL":
            self.buy_order = None
            self.sell_order = order["info"]

    def __init__(self, buy_order, sell_order) -> None:
        self.buy_order = buy_order["info"]
        self.sell_order = sell_order["info"]

    def is_closed(self):
        return (
            self.buy_order["status"] == "FILLED"
            and self.sell_order["status"] == "FILLED"
        )

    def is_buy_order_closed(self):
        return self.buy_order["status"] == "FILLED"

    def is_sell_order_closed(self):
        return self.sell_order["status"] == "FILLED"

    def update_order_info(self, buy_order, sell_order):
        self.buy_order = buy_order["info"]
        self.sell_order = sell_order["info"]


x = {
    "info": {
        "symbol": "ETHUSDT",
        "orderId": "11334610",
        "orderListId": "-1",
        "clientOrderId": "x-R4BD3S82ba22c5120e3f96be58f464",
        "transactTime": "1685729124537",
        "price": "1894.68000000",
        "origQty": "0.01000000",
        "executedQty": "0.00000000",
        "cummulativeQuoteQty": "0.00000000",
        "status": "NEW",
        "timeInForce": "GTC",
        "type": "LIMIT",
        "side": "SELL",
        "workingTime": "1685729124537",
        "fills": [],
        "selfTradePreventionMode": "NONE",
    },
    "id": "11334610",
    "clientOrderId": "x-R4BD3S82ba22c5120e3f96be58f464",
    "timestamp": 1685729124537,
    "datetime": "2023-06-02T18:05:24.537Z",
    "lastTradeTimestamp": 1685729124537,
    "symbol": "ETH/USDT",
    "type": "limit",
    "timeInForce": "GTC",
    "postOnly": False,
    "reduceOnly": None,
    "side": "sell",
    "price": 1894.68,
    "triggerPrice": None,
    "amount": 0.01,
    "cost": 0.0,
    "average": None,
    "filled": 0.0,
    "remaining": 0.01,
    "status": "open",
    "fee": {"currency": None, "cost": None, "rate": None},
    "trades": [],
    "fees": [{"currency": None, "cost": None, "rate": None}],
    "stopPrice": None,
}
