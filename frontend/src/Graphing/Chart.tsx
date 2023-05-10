import { ColorType, CrosshairMode, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { sendAuthentication, sendSubscription } from "./AlpacaSocket";

const Chart = () => {
  const chartContainerRef = useRef(null);
  const API_KEY = "AKXXEXUBUX0WATW7WC28";
  const SECRET_KEY = "5mhAaEF7CwL26C4wCQ7Ww58pyVXfyyaiY35rwixI";
  const WEBSOCKET_URL = "wss://stream.data.alpaca.markets/v1beta3/crypto/us";
  let initialised = false; // Used to prevent useEffect from running multiple times

  const data = [
    { time: "2018-10-19", open: 54.62, high: 55.5, low: 54.52, close: 54.9 },
    { time: "2018-10-22", open: 55.08, high: 55.27, low: 54.61, close: 54.98 },
    { time: "2018-10-23", open: 56.09, high: 57.47, low: 56.09, close: 57.21 },
    { time: "2018-10-24", open: 57.0, high: 58.44, low: 56.41, close: 57.42 },
    { time: "2018-10-25", open: 57.46, high: 57.63, low: 56.17, close: 56.43 },
    { time: "2018-10-26", open: 56.26, high: 56.62, low: 55.19, close: 55.51 },
    { time: "2018-10-29", open: 55.81, high: 57.15, low: 55.72, close: 56.48 },
    { time: "2018-10-30", open: 56.92, high: 58.8, low: 56.92, close: 58.18 },
    { time: "2018-10-31", open: 58.32, high: 58.32, low: 56.76, close: 57.09 },
  ];

  useEffect(() => {
    // Create new chart instance
    const chart = createChart(chartContainerRef.current, {
      width: 600,
      height: 300,
      layout: {
        background: { type: ColorType.Solid, color: "#ffffff" },
        textColor: "#000000",
      },
      rightPriceScale: {
        borderColor: "#cccccc",
      },
      timeScale: {
        borderColor: "#cccccc",
        timeVisible: true,
      },
    });

    chart.applyOptions({
      grid: {
        vertLines: {
          color: "#ffffff",
        },
        horzLines: {
          color: "#ffffff",
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    });

    // Create the main chart series
    const candleSeries = chart.addCandlestickSeries();

    if (!initialised) {
      initialised = true;

      const webSocket = new WebSocket(WEBSOCKET_URL);

      webSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const message = data[0]["msg"];

        if (message === "connected") {
          console.log("Requesting Authentication");
          sendAuthentication(webSocket, API_KEY, SECRET_KEY);
        } else if (message === "authenticated") {
          console.log("Authentication Successful!");
          sendSubscription(webSocket);
        } else if (message === "auth failed") {
          console.log("Authentication Failed");
        } else if (message === "auth timeout") {
          console.log("Authentication Timed Out");
        }
      };

      var start = new Date(Date.now() - 7200 * 1000).toISOString(); // 2 hours ago
      var symbol = "ETH/USD";
      var timeframe = "1Min";
      var bars_URL = `https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols=${symbol}&timeframe=${timeframe}&start=${start}`;

      fetch(bars_URL, {
        headers: {
          "APCA-API-KEY-ID": API_KEY,
          "APCA-API-SECRET-KEY": SECRET_KEY,
        },
      })
        .then((r) => r.json())
        .then((response) => {
          console.log(response);

          const data = response.bars[symbol].map((bar) => ({
            open: bar.o,
            high: bar.h,
            low: bar.l,
            close: bar.c,
            time: Date.parse(bar.t) / 1000,
          }));

          candleSeries.setData(data);
          // currentBar = data[data.length - 1];
        });
    }

    // Add the data to the chart
    candleSeries.setData(data);

    return () => {
      // Cleanup before unmounting
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} />;
};

export default Chart;
