import backtrader
import datetime
import json
import websocket
from gridstrategy import GridStrategy
import io
import sys

cerebro = backtrader.Cerebro()

# Set up the broker with initial cash
broker = backtrader.brokers.BackBroker()
broker.setcash(1000.0)

# Add the BuySell observer
cerebro.addobserver(backtrader.observers.BuySell)


# Create a Data Feed
data = backtrader.feeds.GenericCSVData(
    dataname='./ETHUSDT.csv',

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


def run():

    # Create a StringIO object to store the output
    output_stream = io.StringIO()

    # Redirect the standard output to the StringIO object
    sys.stdout = output_stream

    print('Starting Portfolio Value: %.2f' % cerebro.broker.getvalue())

    # Run the backtest
    cerebro.run()

    print('Final Portfolio Value: %.2f' % cerebro.broker.getvalue())

    # Get the output as a string
    output_string = output_stream.getvalue()

    # Restore the standard output
    sys.stdout = sys.__stdout__

    # Close the output stream
    output_stream.close()

    return output_string

# cerebro.plot(style='candlestick')
