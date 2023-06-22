import backtrader


class GridStrategy(backtrader.Strategy):

    # Used to print out information on orders
    def log(self, txt, dt=None):
        ''' Logging function for this strategy'''
        dt = dt or self.datas[0].datetime.date(0)
        print(f'{dt.isoformat()}, {txt}')

    def __init__(self):
        # Define parameters for grid trading strategy
        self.position_size = 0.1
        self.grid_size = 1
        self.no_of_grids = 5

        # Initial Investment: Place market buy order of (position_size * no_of_grids at current price)
        buy_size = self.position_size * self.no_of_grids
        self.buy_order = self.buy(
            size=buy_size, exectype=backtrader.Order.Market)

        self.log(f'BUY EXECUTED, {self.buy_order}')

        # Keep a reference to the "close" line in the data[0] dataseries
        self.dataclose = self.datas[0].close

    def next(self):
        # Simply log the closing price of the series from the reference
        self.log(f'Close, {self.dataclose[0]}')
