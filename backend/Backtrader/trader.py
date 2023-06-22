import backtrader
import datetime
from gridstrategy import GridStrategy

cerebro = backtrader.Cerebro()

# Set up the broker with initial cash
broker = backtrader.brokers.BackBroker()
broker.setcash(100000.0)

# Create a Data Feed
data = backtrader.feeds.GenericCSVData(
    dataname='./Backtrader/ETHUSDT.csv',

    # Set timeframe to minutes
    timeframe=backtrader.TimeFrame.Minutes,

    # Do not pass values before this date
    fromdate=datetime.datetime(2023, 6, 1, 0, 0, 0),
    todate=datetime.datetime(2023, 6, 1, 0, 59, 0),
    sessionstart=datetime.datetime(2023, 6, 1, 0, 0, 0),
    sessionend=datetime.datetime(2023, 6, 1, 0, 59, 0),

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

# Connect broker to cerebro
cerebro.setbroker(broker)

cerebro.adddata(data)

cerebro.addstrategy(GridStrategy)

print(f"Starting Portfolio Value: {cerebro.broker.getvalue()}")

cerebro.run()

print(f"Final Portfolio Value: {cerebro.broker.getvalue()}")

# cerebro.plot(style='candlestick')
