import ccxt
import config
import datetime
import csv

# Connect to exchange
exchange = ccxt.binance(
    {
        "apiKey": config.API_KEY,
        "secret": config.SECRET_KEY,
    }
)

exchange.set_sandbox_mode(True)
print("Connected to exchange")

# Define the trading pair and timeframe
symbol = 'ETH/USDT'
timeframe = '1m'

# Define the desired time range
start_date = datetime.datetime(2022, 1, 1)  # Specify the start date
end_date = datetime.datetime(2022, 1, 5)  # Specify the end date

# Convert the datetime objects to timestamps
start_timestamp = int(start_date.timestamp() * 1000)
end_timestamp = int(end_date.timestamp() * 1000)

# Set the maximum number of candles to fetch per API call
limit = 1000

# Fetch OHLCV data for the specified time range
ohlcv_data = []

current_timestamp = start_timestamp

while current_timestamp <= end_timestamp:
    # Fetch OHLCV data for the current chunk
    chunk_data = exchange.fetch_ohlcv(
        symbol, timeframe, since=current_timestamp, limit=limit)

    # Append the chunk data to the OHLCV data list
    ohlcv_data.extend(chunk_data)

    # Update the current timestamp to the next chunk
    # Set the next timestamp after the last candle
    current_timestamp = chunk_data[-1][0] + 1

# Print the fetched OHLCV data
for candle in ohlcv_data:
    timestamp, open_, high, low, close, volume = candle
    print(
        f"Timestamp: {timestamp}, Open: {open_}, High: {high}, Low: {low}, Close: {close}, Volume: {volume}")

# Define the path of the CSV file
csv_file = 'BacktestingClient/data_directory/ohlcv/binance/ETHUSDT/ETHUSDT.csv'
headers = ["", "open", "high", "low", "close", "volume"]

# Write the OHLCV data to the CSV file
with open(csv_file, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(headers)  # Write header
    writer.writerows(ohlcv_data)  # Write data rows

print(f"OHLCV data has been saved to {csv_file}")
