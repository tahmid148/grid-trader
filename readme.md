This project consists of creating a platform for users to perform grid-trading on various crypto-currency pairs

To run and install the front end, cd into the frontend directory and run:
    npm i
followed by
    npm start

To run and and install the backend, cd into the backend directory and run:
    pip install -r requirements.txt

To run the websocket server, cd in WebsocketServer and run:
    python3 gridbot_websocket_server.py

To run the gridbot client, cd into GridBotClient and run:
    python3 gridbot_client.py

Load the frontend dashboard. If you followed the steps in this order you should be able
to see the apps functionality.

You will need to have an Alpaca Account and Binance API Key which is stored in /backend/GridBotClient/config.py

To run the Backtrader and to recieve a viewable graph of the results, cd into GridBotClient and run:
    python3 trader.py

You can adjust the settings in backtrade_config.py