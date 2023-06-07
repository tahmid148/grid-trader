class Order:
    def __init__(self, buy_order=None, sell_order=None):
        if buy_order:
            self.buy_order = buy_order["info"]
        else:
            self.buy_order = None
        if sell_order:
            self.sell_order = sell_order["info"]
        else:
            self.sell_order = None

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

    def has_buy_order(self):
        return self.buy_order is not None

    def has_sell_order(self):
        return self.sell_order is not None

    def to_dict(self):
        if self.buy_order and self.sell_order:
            return {
                "buy_order": self.buy_order,
                "sell_order": self.sell_order,
                "open_buy": not self.is_buy_order_closed(),
                "open_sell": not self.is_sell_order_closed(),
            }
        elif self.buy_order:
            return {
                "buy_order": self.buy_order,
                "sell_order": None,
                "open_buy": not self.is_buy_order_closed(),
                "open_sell": True,
            }
        elif self.sell_order:
            return {
                "sell_order": self.sell_order,
                "buy_order": None,
                "open_buy": True,
                "open_sell": not self.is_sell_order_closed(),
            }
