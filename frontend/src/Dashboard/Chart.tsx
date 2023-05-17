import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
} from "lightweight-charts";
import React, { useEffect, useRef, useCallback, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./Chart.css"; // Import the CSS file
import QuotesTable from "./QuotesTable";
import { Container } from "react-bootstrap";

export default function Chart(props) {
  const [currentBar, setCurrentBar] = useState({});

  const [socketUrl, setSocketUrl] = useState(
    "wss://stream.data.alpaca.markets/v1beta3/crypto/us"
  );
  const [botSocketUrl, setBotSocketUrl] = useState("ws://localhost:9001");
  const [messageHistory, setMessageHistory] = useState([]);
  const candleSeriesRef = useRef(null); // Declare candleSeries as a ref
  const [priceLines, setPriceLines] = useState([]); // Trade lines for chart
  const [quotesInfo, setQuotesInfo] = useState([]);
  const [tradesInfo, setTradesInfo] = useState([]);
  const [tradePrices, setTradePrices] = useState([]); // Tracks last 10 trade prices
  const [openOrders, setOpenOrders] = useState([]);
  const [closedOrders, setClosedOrders] = useState([]);
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
          setQuotesInfo((prevQuotes) => {
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
          //   console.log(trade);
          setTradesInfo((prevTrades) => {
            const newTrades = [...prevTrades, trade];
            if (newTrades.length > MAX_SIZE) {
              newTrades.shift(); // Remove the oldest trade
            }
            return newTrades;
          });

          setTradePrices((prevPrices) => {
            const newTrades = [...prevPrices, trade.price];
            if (newTrades.length > MAX_SIZE) {
              newTrades.shift(); // Remove the oldest trade
            }
            return newTrades;
          });
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
          //   console.log(currentBar);
          candleSeriesRef.current.update(currentBar);
        }
      }
    },
  });

  useEffect(() => {
    if (Object.keys(currentBar).length !== 0 && tradePrices.length > 0) {
      // Update the chart when tradePrices changes
      var open = tradePrices[0];
      var high = Math.max(...tradePrices);
      var low = Math.min(...tradePrices);
      var close = tradePrices[tradePrices.length - 1];

      candleSeriesRef.current.update({
        time: currentBar["time"],
        open: open,
        high: high,
        low: low,
        close: close,
      });
    }
    console.log("Updating Chart!");
  }, [tradePrices]);

  const botWebSocket = useWebSocket(botSocketUrl, {
    onOpen: () => console.log("Bot Socket Connected!"),

    onMessage: (event) => {
      console.log("Bot Message Received!");

      try {
        // Clear Price Lines and Open Orders
        priceLines.forEach((line) => {
          candleSeriesRef.current.removePriceLine(line);
        });

        // Addd new Price Lines and Open Orders to Chart
        const orderData = JSON.parse(event.data);
        const openOrders = orderData.filter((order) => order.status === "NEW");
        const closedOrders = orderData.filter(
          (order) => order.status === "FILLED"
        );
        setOpenOrders(openOrders);
        setClosedOrders(closedOrders);
        console.log("Open Orders:");
        console.log(openOrders);
        console.log("Closed Orders:");
        console.log(closedOrders);

        orderData.forEach((order) => {
          //   console.log(order);

          if (order.status === "FILLED") {
            console.log("Order Filled!");
          } else {
            // Create Price Line for chart for Open Orders
            const priceLine = {
              price: parseFloat(order.price),
              color: order.side === "BUY" ? "#00ff00" : "#ff0000",
              lineWidth: 1,
              lineStyle: LineStyle.Solid,
              axisLabelVisible: true,
              title: order.side,
            };
            var line = candleSeriesRef.current.createPriceLine(priceLine);
            priceLines.push(line);
          }
        });
      } catch (error) {
        console.log(error);
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
    // console.log("Current Bar:");
    // console.log(currentBar);

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
    <Container fluid>
      <div className="all-container">
        <div ref={chartContainerRef} />
        <div className="right-container">
          <div className="right-container-1">
            <div className="title">
              Quotes (Bid Price, Ask Price)
              <div className="inner-container">
                {quotesInfo.map((quote, index) => (
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
                {tradesInfo.map((trade, index) => (
                  <p key={index}>
                    {trade.time} - {trade.price} | {trade.size}
                    <br />
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="right-container-2">
            <div className="title">
              Open Orders
              <div className="inner-container">
                {openOrders.map((order, index) => (
                  <p key={index}>
                    {order.side} - {order.price} | {order.origQty}
                  </p>
                ))}
              </div>
            </div>
            <div className="title">
              Closed Orders
              <div className="inner-container">
                {closedOrders.map((order, index) => (
                  <p key={index}>
                    {order.side} - {order.price} | {order.origQty}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <QuotesTable quotesInfo={quotesInfo} />
    </Container>
  );
}
