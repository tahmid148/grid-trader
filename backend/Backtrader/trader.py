import backtrader

cerebro = backtrader.Cerebro()

cerebro.broker.setcash(1000000)

print(f"Starting Portfolio Value: {cerebro.broker.getvalue()}")

cerebro.run()

print(f"Final Portfolio Value: {cerebro.broker.getvalue()}")
