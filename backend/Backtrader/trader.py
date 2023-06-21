import backtrader
import datetime

cerebro = backtrader.Cerebro()

cerebro.broker.setcash(1000000)

print(f"Starting Portfolio Value: {cerebro.broker.getvalue()}")

data = backtrader.GenericCSVData(
    dataname='./Backtrader/ETHUSDT.csv',

    fromdate=datetime.datetime(2000, 1, 1),
    todate=datetime.datetime(2000, 12, 31),

    nullvalue=0.0,

    dtformat=('%Y-%m-%d'),

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
