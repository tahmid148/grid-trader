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
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import TradesTable from "./TradesTable";
import OpenOrdersTable from "./OpenOrdersTable";
import ClosedOrdersTable from "./ClosedOrdersTable";

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
  const [profit, setProfit] = useState(0);

  const [positionSizeInput, setPositionSizeInput] = useState(0.01);
  const [positionSize, setPositionSize] = useState(0.01);
  const [numberOfGridLinesInput, setNumberOfGridLinesInput] = useState(5);
  const [numberOfGridLines, setNumberOfGridLines] = useState(5);
  const [gridSizeInput, setGridSizeInput] = useState(0.5);
  const [gridSize, setGridSize] = useState(0.5);
  const MAX_SIZE = 100;

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
    onOpen: () => {
      console.log("Bot Socket Connected!");
      const payload = { client_type: "frontend" };
      botWebSocket.sendMessage(JSON.stringify(payload));
      console.log("Sent Client Type Message to WebSocket Server");
    },

    onMessage: (event) => {
      console.log("Bot Message Received!");

      try {
        // Parse the message
        var data = JSON.parse(event.data);
        console.log(data);

        if ("order_data" in data) {
          const orderData = data["order_data"];
          // Clear Price Lines and Open Orders
          priceLines.forEach((line) => {
            candleSeriesRef.current.removePriceLine(line);
          });

          // Addd new Price Lines and Open Orders to Chart
          const profit = orderData[orderData.length - 1];
          const openOrders = orderData.filter(
            (order) => order.status === "NEW"
          );
          const closedOrders = orderData.filter(
            (order) => order.status === "FILLED"
          );
          setOpenOrders(openOrders);
          setClosedOrders(closedOrders);
          setProfit(profit["total_profit"]);
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
        } else if ("dashboard_update" in data) {
          const dashboardUpdateData = data["dashboard_update"];
        }
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
      <Row>
        <Col>
          <div ref={chartContainerRef} />
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Profit/Loss:</Card.Title>
              <Card.Text>${profit}</Card.Text>
            </Card.Body>
          </Card>
          <Row>
            <Col className="position-size-form">
              <Form>
                <Form.Group>
                  <Form.Label>Position Size</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={positionSizeInput}
                    onChange={(event) => {
                      setPositionSizeInput(parseFloat(event.target.value));
                    }}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col className="position-size-form">
              <Form>
                <Form.Group>
                  <Form.Label>Number of Grid Lines</Form.Label>
                  <Form.Control
                    type="number"
                    step="1"
                    min="1"
                    value={numberOfGridLinesInput}
                    onChange={(event) => {
                      setNumberOfGridLinesInput(parseInt(event.target.value));
                    }}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col className="position-size-form">
              <Form>
                <Form.Group>
                  <Form.Label>Grid Size</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={gridSizeInput}
                    onChange={(event) => {
                      setGridSizeInput(parseFloat(event.target.value));
                    }}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Button
              className="settings-button"
              onClick={(event) => {
                event.preventDefault();
                setPositionSize(positionSizeInput);
                setNumberOfGridLines(numberOfGridLinesInput);
                setGridSize(gridSizeInput);
                // TODO: Sent a message to the backend
                const payload = {
                  // Front to Back Message
                  msg: "settings",
                  position_size: positionSizeInput,
                  number_of_grid_lines: numberOfGridLinesInput,
                  grid_size: gridSizeInput,
                };
                console.log("Sending Settings Message");
                botWebSocket.sendMessage(JSON.stringify(payload));
              }}
            >
              Submit Settings
            </Button>
          </Row>
          <Button
            className="start-bot-button"
            onClick={(event) => {
              event.preventDefault();
              // Send signal to backend to start bot
              const payload = { msg: "gridbot", action: "start" };
              console.log(JSON.stringify(payload));
              botWebSocket.sendMessage(JSON.stringify(payload));
            }}
          >
            Start Bot
          </Button>
        </Col>
        <Col>
          <QuotesTable quotesInfo={quotesInfo} />
          <TradesTable tradesInfo={tradesInfo} />
          <OpenOrdersTable openOrders={openOrders} />
          <ClosedOrdersTable closedOrders={closedOrders} />
        </Col>
      </Row>
    </Container>
  );
}
