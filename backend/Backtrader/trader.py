import backtrader
import datetime

cerebro = backtrader.Cerebro()

cerebro.broker.setcash(1000000)

print(f"Starting Portfolio Value: {cerebro.broker.getvalue()}")

data = backtrader.GenericCSVData(
    dataname='./Backtrader/ETHUSDT.csv',

    # Specify the desired date range
    fromdate=datetime.datetime(2023, 6, 1, 0, 0, 0),
    todate=datetime.datetime(2023, 6, 15, 23, 59, 0),


    nullvalue=0.0,

    dtformat='%Y-%m-%d %H:%M:%S',

    datetime=0,
    high=1,
    low=2,
    open=3,
    close=4,
    volume=5,
    openinterest=-1
)


cerebro.run()

print(f"Final Portfolio Value: {cerebro.broker.getvalue()}")
