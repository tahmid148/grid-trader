import backtrader
import datetime
from gridstrategy import GridStrategy

cerebro = backtrader.Cerebro()

cerebro.broker.setcash(1000000)

# Create a Data Feed
data = backtrader.feeds.YahooFinanceCSVData(
    dataname='./Backtrader/ETHUSDT.csv',
    # Do not pass values before this date
    fromdate=datetime.datetime(2023, 6, 1, 0, 0, 0),
    # Do not pass values after this date
    todate=datetime.datetime(2023, 6, 2, 23, 59, 0),
    reverse=False)

cerebro.adddata(data)

cerebro.addstrategy(GridStrategy)

print(f"Starting Portfolio Value: {cerebro.broker.getvalue()}")

cerebro.run()

print(f"Final Portfolio Value: {cerebro.broker.getvalue()}")

# cerebro.plot(style='candlestick')
