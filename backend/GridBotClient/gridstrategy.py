import backtrader
import backtrade_config


class GridStrategy(backtrader.Strategy):

    def log(self, txt, dt=None):
        ''' Logging function for this strategy'''
        dt = dt or self.datas[0].datetime.datetime(0)
        print(f"{dt.isoformat()}, {txt}")

    def __init__(self):
        # Initialise grid parameters
        self.position_size = backtrade_config.position_size
        self.grid_size = backtrade_config.grid_size
        self.no_of_grids = backtrade_config.no_of_grids

        # Keep a reference to the "close" line in the data[0] dataseries
        self.dataclose = self.datas[0].close

        # Place a market buy order
        self.open_positions = []

        # Buy inital position
        self.has_started = True

    def notify_order(self, order):
        if order.status in [order.Submitted, order.Accepted]:
            # Buy/Sell order submitted/accepted to/by broker - Nothing to do
            return

        # Check if an order has been completed
        # Attention: broker could reject order if not enough cash
        if order.status in [order.Completed]:
            if order.isbuy():
                # Buy Order executed
                self.log('BUY EXECUTED, %.2f' % order.executed.price)
                # Place Limit Sell Order at price + grid_size
                self.log(
                    f"SELL LIMIT CREATED @ {order.executed.price + self.grid_size}")
                self.open_positions.append(self.sell(
                    exectype=backtrader.Order.Limit, price=order.executed.price + self.grid_size, size=self.position_size))
            elif order.issell():
                # Sell Order executed
                self.log('SELL EXECUTED, %.2f' % order.executed.price)
                # Place Limit Buy Order at price - grid_size
                self.log(
                    f"BUY LIMIT CREATED @ {order.executed.price - self.grid_size}")
                self.open_positions.append(
                    self.buy(exectype=backtrader.Order.Limit, price=order.executed.price - self.grid_size, size=self.position_size))

            self.bar_executed = len(self)

        elif order.status in [order.Canceled, order.Margin, order.Rejected]:
            self.log(f"Order Canceled/Margin/Rejected: {order.status}")

        # Write down: no pending order
        # self.order = None

    def next(self):
        # Simply log the closing price of the series from the reference
        self.log('Close, %.2f' % self.dataclose[0])

        # Initial grids being set
        if self.has_started:
            self.has_started = False
            print("Starting")

            # Place initial market buy orders
            self.log(
                f"BUY INITIAL, Size: {self.position_size} * {self.no_of_grids} @ {self.dataclose[0]}")

            for _ in range(self.no_of_grids):
                self.open_positions.append(self.buy(size=self.position_size))

            # Place limit buy orders
            for i in range(self.no_of_grids):
                self.log(
                    f"BUY LIMIT {i+1} @ {self.dataclose[0] - (i+1) * self.grid_size}")
                self.open_positions.append(self.buy(
                    exectype=backtrader.Order.Limit,
                    price=self.dataclose[0] - (i+1) * self.grid_size, size=self.position_size
                ))

            # Place limit sell orders
            for i in range(self.no_of_grids):
                self.log(
                    f"SELL LIMIT {i+1} @ {self.dataclose[0] + (i+1) * self.grid_size}")
                self.open_positions.append(self.sell(
                    exectype=backtrader.Order.Limit,
                    price=self.dataclose[0] + (i+1) * self.grid_size, size=self.position_size
                ))
