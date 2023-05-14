import { createChart, ColorType, CrosshairMode } from "lightweight-charts";
import React, { useEffect, useRef, useCallback, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./Chart.css"; // Import the CSS file

export default function Chart(props) {
  //   var currentBar = {};
  const [socketUrl, setSocketUrl] = useState(
    "wss://stream.data.alpaca.markets/v1beta3/crypto/us"
  );
  const [messageHistory, setMessageHistory] = useState([]);

  const [quotes, setQuotes] = useState([]);
  const [trades, setTrades] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      const message = data[0]["msg"];

      if (message === "connected") {
        console.log("Requesting Authentication");
        // Send authentication request
        console.log("Sending Auth Message");
        const payload = {
          action: "auth",
          key: "AKXXEXUBUX0WATW7WC28",
          secret: "5mhAaEF7CwL26C4wCQ7Ww58pyVXfyyaiY35rwixI",
        };
        sendMessage(JSON.stringify(payload));
      } else if (message === "authenticated") {
        console.log("Authentication Successful!");
        // Send subscription request
        const subscribeMessage = {
          action: "subscribe",
          trades: ["ETH/USD"],
          quotes: ["ETH/USD"],
          bars: ["ETH/USD"],
        };
        sendMessage(JSON.stringify(subscribeMessage));
      } else if (message === "auth failed") {
        console.log("Authentication Failed");
      } else if (message === "auth timeout") {
        console.log("Authentication Timed Out");
      }

      for (var key in data) {
        const type = data[key].T;

        if (type === "q") {
          // Quote
          console.log("Quote:");
          //   console.log(data[key]);
          // Need to store Time T, Bid price bp, Ask Price ap
          const quote = {
            time: data[key].T,
            bidPrice: data[key].bp,
            askPrice: data[key].ap,
          };
          setQuotes((prevQuotes) => [...prevQuotes, quote]);
          console.log(quotes);
        } else if (type === "t") {
          // Trade
          console.log("Trade:");
          //   console.log(data[key]);
          // Need to store Time T, Price p, Size s
          const trade = {
            time: data[key].T,
            price: data[key].p,
            size: data[key].s,
          };
          setTrades((prevTrades) => [...prevTrades, trade]);
          console.log(trades);
        } else if (type === "b") {
          // Bar
          console.log("Bar:");
          console.log(data[key]);
        }
      }
    },
  });

  //   useEffect(() => {});

  const {
    data,
    colors: {
      backgroundColor = "white",
      lineColor = "#2962FF",
      textColor = "black",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
  } = props;

  const chartContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const gridOptions = {
      vertLines: { color: "#404040" },
      horzLines: { color: "#404040" },
      priceScale: { borderColor: "#cccccc" },
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: 700,
      height: 600,
      grid: gridOptions,
      timeScale: {
        timeVisible: true,
        borderColor: "#cccccc",
        secondsVisible: true,
      },
    });

    chart.applyOptions({
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    });

    chart.timeScale().fitContent();

    const candleSeries = chart.addCandlestickSeries();

    candleSeries.setData(data);
    // currentBar = data[data.length - 1];

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);

  return (
    <div className="all-container">
      <div ref={chartContainerRef} />
      <div className="right-container-1">
        <div className="title">
          Quotes
          <div className="inner-container"></div>
        </div>
        <div className="title">
          Trades
          <div className="inner-container"></div>
        </div>
      </div>
    </div>
  );
}
