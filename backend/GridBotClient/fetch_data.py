import ccxt
import config
import datetime
import csv


ohlcv_data = []
binance_data_csv = 'update_timestamp.csv'
with open(binance_data_csv, 'r') as file:
    csv_reader = csv.reader(file)

    for row in csv_reader:
        row[0] = int(row[0])
        ohlcv_data.append(row[:6])

# Print the fetched OHLCV data
for candle in ohlcv_data:
    timestamp, open_, high, low, close, volume = candle
    print(
        f"Timestamp: {datetime.datetime.fromtimestamp(timestamp / 1000).strftime('%Y-%m-%d %H:%M:%S')}, Open: {open_}, High: {high}, Low: {low}, Close: {close}, Volume: {volume}")

# Define the path of the CSV file
csv_file = 'BacktestingClient/data_directory/ohlcv/binance/ETHUSDT.csv'
headers = ["", "open", "high", "low", "close", "volume"]

# Convert the OHLCV data to the desired timestamp format
formatted_ohlcv_data = [[datetime.datetime.fromtimestamp(
    candle[0] / 1000).strftime('%Y-%m-%d %H:%M:%S'), *candle[1:]] for candle in ohlcv_data]

# Write the OHLCV data to the CSV file
with open(csv_file, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(headers)  # Write header
    writer.writerows(formatted_ohlcv_data)  # Write data rows

print(f"OHLCV data has been saved to {csv_file}")
