class Order:
    def __init__(self, buy_order=None, sell_order=None, id=-1, profit=0):
        if buy_order:
            self.buy_order = buy_order["info"]
        else:
            self.buy_order = None
        if sell_order:
            self.sell_order = sell_order["info"]
        else:
            self.sell_order = None
        self.id = id
        self.profit = 0

    def set_buy_order(self, buy_order):
        self.buy_order = buy_order["info"]

    def set_sell_order(self, sell_order):
        self.sell_order = sell_order["info"]

    def set_id(self, id):
        self.id = id

    def has_buy_order(self):
        return self.buy_order is not None

    def has_sell_order(self):
        return self.sell_order is not None

    def is_closed(self):
        return (
            self.has_buy_order()
            and self.has_sell_order()
            and self.buy_order["status"] == "FILLED"
            and self.sell_order["status"] == "FILLED"
        )

    def is_buy_order_closed(self):
        return self.buy_order["status"] == "FILLED"

    def is_sell_order_closed(self):
        return self.sell_order["status"] == "FILLED"

    def update_order_info(self, buy_order, sell_order):
        self.buy_order = buy_order["info"]
        self.sell_order = sell_order["info"]

    def update_profit(self, current_price=0):
        buy_price = 0
        qty = 0
        if self.has_buy_order() and ((not self.has_sell_order()) or (not self.is_sell_order_closed())) and self.is_buy_order_closed():
            if self.buy_order["type"] == "LIMIT":
                buy_price = float(self.buy_order["price"])
                qty = float(self.buy_order["origQty"])
            elif self.buy_order["type"] == "MARKET":
                buy_price = float(self.buy_order["fills"][0]["price"])
                qty = float(self.buy_order["fills"][0]["qty"])

            self.profit = (current_price - buy_price) * qty
            print(
                f"Bought at {buy_price} and current price is {current_price} and quantity is {qty} and profit is {self.profit}")
        elif self.has_buy_order() and self.has_sell_order() and self.is_sell_order_closed() and self.is_buy_order_closed():
            if self.buy_order["type"] == "LIMIT":
                buy_price = float(self.buy_order["price"])
                qty = float(self.buy_order["origQty"])
            elif self.buy_order["type"] == "MARKET":
                buy_price = float(self.buy_order["fills"][0]["price"])
                qty = float(self.buy_order["fills"][0]["qty"])

            sell_price = float(self.sell_order["price"])
            qty = float(self.buy_order["origQty"])
            self.profit = (sell_price - buy_price) * qty
            print(
                f"Bought at {buy_price} and sold at {sell_price} and quantity is {qty} and profit is {self.profit}")

    def to_dict(self):
        if self.buy_order and self.sell_order:
            return {
                "buy_order": self.buy_order,
                "sell_order": self.sell_order,
                "open_buy": not self.is_buy_order_closed(),
                "open_sell": not self.is_sell_order_closed(),
                "id": self.id,
                "profit": self.profit,
            }
        elif self.buy_order:
            return {
                "buy_order": self.buy_order,
                "sell_order": None,
                "open_buy": not self.is_buy_order_closed(),
                "open_sell": True,
                "id": self.id,
                "profit": self.profit,
            }
        elif self.sell_order:
            return {
                "sell_order": self.sell_order,
                "buy_order": None,
                "open_buy": True,
                "open_sell": not self.is_sell_order_closed(),
                "id": self.id,
                "profit": self.profit,
            }


buy_order = {
    "symbol": "ETHUSDT",
    "orderId": "1783561",
    "orderListId": "-1",
    "clientOrderId": "x-R4BD3S82a213b84dbb7c498ddff66d",
    "transactTime": "1686580321754",
    "price": "0.00000000",
    "origQty": "0.01000000",
    "executedQty": "0.01000000",
    "cummulativeQuoteQty": "17.39830000",
    "status": "FILLED",
    "timeInForce": "GTC",
    "type": "MARKET",
    "side": "BUY",
    "workingTime": "1686580321754",
    "fills": [
        {
            "price": "1739.83000000",
            "qty": "0.01000000",
            "commission": "0.00000000",
            "commissionAsset": "ETH",
            "tradeId": "283352",
        }
    ],
    "selfTradePreventionMode": "NONE",
}
sell_order = {
    "symbol": "ETHUSDT",
    "orderId": "1783557",
    "orderListId": "-1",
    "clientOrderId": "x-R4BD3S82d89bf816611998beb81b97",
    "price": "1740.01000000",
    "origQty": "0.01000000",
    "executedQty": "0.00000000",
    "cummulativeQuoteQty": "0.00000000",
    "status": "NEW",
    "timeInForce": "GTC",
    "type": "LIMIT",
    "side": "SELL",
    "stopPrice": "0.00000000",
    "icebergQty": "0.00000000",
    "time": "1686580321120",
    "updateTime": "1686580321120",
    "isWorking": True,
    "workingTime": "1686580321120",
    "origQuoteOrderQty": "0.00000000",
    "selfTradePreventionMode": "NONE",
}
