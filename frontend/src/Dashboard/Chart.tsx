import { createChart, ColorType, CrosshairMode } from "lightweight-charts";
import React, { useEffect, useRef, useCallback, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./Chart.css"; // Import the CSS file

export default function Chart(props) {
  const [currentBar, setCurrentBar] = useState({});

  const [socketUrl, setSocketUrl] = useState(
    "wss://stream.data.alpaca.markets/v1beta3/crypto/us"
  );
  const [messageHistory, setMessageHistory] = useState([]);
  const candleSeriesRef = useRef(null); // Declare candleSeries as a ref
  const [quotes, setQuotes] = useState([]);
  const [trades, setTrades] = useState([]);
  const MAX_SIZE = 10;

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
          console.log("Incoming Quote!");
          // Need to store Time T, Bid price bp, Ask Price ap
          const quote = {
            time: data[key].t,
            bidPrice: data[key].bp,
            askPrice: data[key].ap,
          };
          setQuotes((prevQuotes) => {
            const newQuotes = [...prevQuotes, quote];
            if (newQuotes.length > MAX_SIZE) {
              newQuotes.shift(); // Remove the oldest quote
            }
            return newQuotes;
          });
        } else if (type === "t") {
          // Trade
          // Need to store Time T, Price p, Size s
          console.log("Incoming Trade!");
          const trade = {
            time: data[key].t,
            price: data[key].p,
            size: data[key].s,
          };
          setTrades((prevTrades) => {
            const newTrades = [...prevTrades, trade];
            if (newTrades.length > MAX_SIZE) {
              newTrades.shift(); // Remove the oldest trade
            }
            return newTrades;
          });

          // Update the chart
          if (trades.length > 0) {
            var open = trades[0].price;
            var high = trades.reduce(
              (max, p) => (p.price > max ? p.price : max),
              trades[0].price
            );
            var low = trades.reduce(
              (min, trade) => (trade.price < min ? trade.price : min),
              Infinity
            );
            var close = trades[trades.length - 1].price;

            // const incomingTrade = {
            //   time: unixTimestamp + 60,
            //   open: open,
            //   high: high,
            //   low: low,
            //   close: close,
            // };
            // console.log(incomingTrade);
            // candleSeriesRef.current.update(incomingTrade);
          }
        } else if (type === "b") {
          // Bar
          console.log("Incoming Bar!");
          var bar = data[key];
          var timestamp = new Date(bar.t).getTime() / 1000;

          const incomingBar = {
            time: timestamp,
            open: bar.o,
            high: bar.h,
            low: bar.l,
            close: bar.c,
          };
          setCurrentBar(incomingBar);
          console.log(currentBar);
          candleSeriesRef.current.update(currentBar);
        }
      }
    },
  });

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

    candleSeriesRef.current = chart.addCandlestickSeries(); // Assign candleSeries to the ref

    candleSeriesRef.current.setData(data);
    setCurrentBar(data[data.length - 1]);

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
          Quotes (Bid Price, Ask Price)
          <div className="inner-container">
            {quotes.map((quote, index) => (
              <p key={index}>
                {quote.time} - {quote.bidPrice} | {quote.askPrice}
                <br />
              </p>
            ))}
          </div>
        </div>
        <div className="title">
          Trades (Price, Size)
          <div className="inner-container">
            {trades.map((trade, index) => (
              <p key={index}>
                {trade.time} - {trade.price} | {trade.size}
                <br />
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
