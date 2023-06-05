class Order:
    def __init__(self, buy_order=None, sell_order=None):
        self.buy_order = buy_order["info"]
        self.sell_order = sell_order["info"]

    def set_buy_order(self, buy_order):
        self.buy_order = buy_order["info"]

    def set_sell_order(self, sell_order):
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
        "orderId": "12280707",
        "orderListId": "-1",
        "clientOrderId": "x-R4BD3S824f8e87255a9b53554ab25a",
        "transactTime": "1685985441683",
        "price": "0.00000000",
        "origQty": "0.05000000",
        "executedQty": "0.05000000",
        "cummulativeQuoteQty": "90.30450000",
        "status": "FILLED",
        "timeInForce": "GTC",
        "type": "MARKET",
        "side": "BUY",
        "workingTime": "1685985441683",
        "fills": [
            {
                "price": "1806.09000000",
                "qty": "0.05000000",
                "commission": "0.00000000",
                "commissionAsset": "ETH",
                "tradeId": "2128279",
            }
        ],
        "selfTradePreventionMode": "NONE",
    },
    "id": "12280707",
    "clientOrderId": "x-R4BD3S824f8e87255a9b53554ab25a",
    "timestamp": 1685985441683,
    "datetime": "2023-06-05T17:17:21.683Z",
    "lastTradeTimestamp": 1685985441683,
    "symbol": "ETH/USDT",
    "type": "market",
    "timeInForce": "GTC",
    "postOnly": False,
    "reduceOnly": None,
    "side": "buy",
    "price": 1806.09,
    "triggerPrice": None,
    "amount": 0.05,
    "cost": 90.3045,
    "average": 1806.09,
    "filled": 0.05,
    "remaining": 0.0,
    "status": "closed",
    "fee": {"currency": None, "cost": None, "rate": None},
    "trades": [
        {
            "info": {
                "price": "1806.09000000",
                "qty": "0.05000000",
                "commission": "0.00000000",
                "commissionAsset": "ETH",
                "tradeId": "2128279",
            },
            "timestamp": None,
            "datetime": None,
            "symbol": "ETH/USDT",
            "id": "2128279",
            "order": None,
            "type": None,
            "side": None,
            "takerOrMaker": None,
            "price": 1806.09,
            "amount": 0.05,
            "cost": 90.3045,
            "fee": {"cost": 0.0, "currency": "ETH"},
            "fees": [{"cost": 0.0, "currency": "ETH"}],
        }
    ],
    "fees": [{"currency": None, "cost": None, "rate": None}],
    "stopPrice": None,
}
