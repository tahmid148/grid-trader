import { useEffect } from "react";
import { sendAuthentication, sendSubscription } from "./Graphing/AlpacaSocket";
import Chart from "./Graphing/Chart";

function App() {
  const API_KEY = "AKXXEXUBUX0WATW7WC28";
  const SECRET_KEY = "5mhAaEF7CwL26C4wCQ7Ww58pyVXfyyaiY35rwixI";
  const WEBSOCKET_URL = "wss://stream.data.alpaca.markets/v1beta3/crypto/us";
  let initalised = false; // Used to prevent useEffect from running multiple times

  // useEffect(() => {
  //   if (!initalised) {
  //     initalised = true;

  //     const webSocket = new WebSocket(WEBSOCKET_URL);

  //     webSocket.onmessage = (event) => {
  //       const data = JSON.parse(event.data);
  //       const message = data[0]["msg"];

  //       if (message === "connected") {
  //         console.log("Requesting Authentication");
  //         sendAuthentication(webSocket, API_KEY, SECRET_KEY);
  //       } else if (message === "authenticated") {
  //         console.log("Authentication Successful!");
  //         sendSubscription(webSocket);
  //       } else if (message === "auth failed") {
  //         console.log("Authentication Failed");
  //       } else if (message === "auth timeout") {
  //         console.log("Authentication Timed Out");
  //       }
  //     };

  //     var start = new Date(Date.now() - 7200 * 1000).toISOString(); // 2 hours ago
  //     var symbol = "ETH/USD";
  //     var timeframe = "1Min";
  //     var bars_URL = `https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols=${symbol}&timeframe=${timeframe}&start=${start}`;

  //     fetch(bars_URL, {
  //       headers: {
  //         "APCA-API-KEY-ID": API_KEY,
  //         "APCA-API-SECRET-KEY": SECRET_KEY,
  //       },
  //     })
  //       .then((r) => r.json())
  //       .then((response) => {
  //         console.log(response);

  //         const data = response.bars[symbol].map((bar) => ({
  //           open: bar.o,
  //           high: bar.h,
  //           low: bar.l,
  //           close: bar.c,
  //           time: Date.parse(bar.t) / 1000,
  //         }));

  //         candleSeries.setData(data);
  //         currentBar = data[data.length - 1];
  //       });
  //   }
  // }, []);

  return (
    <>
      <Chart />
    </>
  );
}

export default App;
