import backtrader
import datetime
from gridstrategy import GridStrategy

cerebro = backtrader.Cerebro()

cerebro.broker.setcash(1000000)

# Create a Data Feed
data = backtrader.feeds.GenericCSVData(
    dataname='./Backtrader/ETHUSDT.csv',

    # Do not pass values before this date
    fromdate=datetime.datetime(2023, 6, 1, 0, 0, 0),
    todate=datetime.datetime(2023, 6, 2, 23, 59, 0),

    # Value for missing data
    nullvalue=0.0,

    # Date time format
    dtformat=('%Y-%m-%d %H:%M:%S'),

    datetime=0,
    open=1,
    high=2,
    low=3,
    close=4,
    openinterest=-1
)

cerebro.adddata(data)

cerebro.addstrategy(GridStrategy)

print(f"Starting Portfolio Value: {cerebro.broker.getvalue()}")

cerebro.run()

print(f"Final Portfolio Value: {cerebro.broker.getvalue()}")

# cerebro.plot(style='candlestick')
