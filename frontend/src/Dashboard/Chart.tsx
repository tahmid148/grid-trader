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
import CurrentTrades from "./CurrentTrades";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  ProgressBar,
  Row,
} from "react-bootstrap";
import TradesTable from "./TradesTable";
import OpenOrdersTable from "./OpenOrdersTable";
import ClosedOrdersTable from "./ClosedOrdersTable";
import * as Icon from "react-bootstrap-icons";

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
  const [lastClose, setLastClose] = useState(0);
  const [profit, setProfit] = useState(0);

  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(false);
  const [isStopButtonDisabled, setIsStopButtonDisabled] = useState(true);

  const [showPositionSizeModal, setShowPositionSizeModal] = useState(false);
  const [positionSizeLabel, setPositionSizeLabel] = useState("");

  const [positionSizeInput, setPositionSizeInput] = useState(0.01);
  const [positionSize, setPositionSize] = useState(0.01);
  const [numberOfGridLinesInput, setNumberOfGridLinesInput] = useState(5);
  const [numberOfGridLines, setNumberOfGridLines] = useState(5);
  const [gridSizeInput, setGridSizeInput] = useState(0.5);
  const [gridSize, setGridSize] = useState(0.5);
  const MAX_SIZE = 100;
  const [average, setAverage] = useState(0);

  useEffect(() => {
    // Calculate the average of Position Size, Grid Size, and Number of Grid Lines
    const sum = positionSize + gridSize + numberOfGridLines;
    const averageValue = sum / 3;
    setAverage(averageValue);
  }, [positionSize, gridSize, numberOfGridLines]);

  const calculateProgressBarPercentage = () => {
    // Calculate the percentage for the progress bar
    const percentage = (average / 10) * 100;
    return Math.min(percentage, 100); // Cap the percentage at 100
  };

  const handlePositionSizeModalShow = (label) => {
    setPositionSizeLabel(label);
    setShowPositionSizeModal(true);
  };

  const handlePositionSizeModalClose = () => {
    setShowPositionSizeModal(false);
  };

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
          console.log(quote);
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
          console.log(trade);
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
          console.log(currentBar);
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

          // Add new Price Lines and Open Orders to Chart
          var openOrders = [];

          for (var key in orderData) {
            const buyOrder = orderData[key]["buy_order"];
            const sellOrder = orderData[key]["sell_order"];
            if (orderData[key]["open_buy"] && buyOrder) {
              openOrders.push(buyOrder);
            }
            if (orderData[key]["open_sell"] && sellOrder) {
              openOrders.push(sellOrder);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }

      // try {
      //   // Parse the message
      //   var data = JSON.parse(event.data);
      //   console.log(data);

      //   if ("order_data" in data) {
      //     const orderData = data["order_data"];
      //     // Clear Price Lines and Open Orders
      //     priceLines.forEach((line) => {
      //       candleSeriesRef.current.removePriceLine(line);
      //     });

      //     setLastClose(orderData[orderData.length - 2]);

      //     // Addd new Price Lines and Open Orders to Chart
      //     const profit = orderData[orderData.length - 1];
      //     const openOrders = orderData.filter(
      //       (order) => order.status === "NEW"
      //     );
      //     const closedOrders = orderData.filter(
      //       (order) => order.status === "FILLED"
      //     );
      //     setOpenOrders(openOrders);
      //     setClosedOrders(closedOrders);
      //     // setProfit(profit["total_profit"]);
      //     setProfit(calculateProfit());

      //     orderData.forEach((order) => {
      //       //   console.log(order);

      //       if (order.status === "FILLED") {
      //         console.log("Order Filled!");
      //       } else {
      //         // Create Price Line for chart for Open Orders
      //         const priceLine = {
      //           price: parseFloat(order.price),
      //           color: order.side === "BUY" ? "#00ff00" : "#ff0000",
      //           lineWidth: 1,
      //           lineStyle: LineStyle.Solid,
      //           axisLabelVisible: true,
      //           title: order.side,
      //         };
      //         var line = candleSeriesRef.current.createPriceLine(priceLine);
      //         priceLines.push(line);
      //       }
      //     });
      //   } else if ("dashboard_update" in data) {
      //     // Disable/Enable appropriate buttons
      //     console.log(data["dashboard_update"]);
      //     const startDisabled = data["dashboard_update"] === "true";
      //     console.log("StartDisabled: " + startDisabled);
      //     setIsStartButtonDisabled(startDisabled);
      //     setIsStopButtonDisabled(!startDisabled);
      //   } else if ("chart_update" in data) {
      //     // Clear Open Orders
      //     setOpenOrders([]);
      //     priceLines.forEach((line) => {
      //       candleSeriesRef.current.removePriceLine(line);
      //     });
      //     setPriceLines([]);
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
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

  const calculateProfit = () => {
    let profit = 0;
    closedOrders.forEach((order) => {
      profit +=
        (lastClose - parseFloat(order["price"])) * parseFloat(order["origQty"]);
    });
    console.log("Profit: " + profit);
    return profit;
  };

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

  const calculateProgressBarVariant = () => {
    // Calculate the variant (color) for the progress bar
    if (average <= 3.33) {
      return "success"; // Green color for 1/3 or less
    } else if (average <= 6.67) {
      return "warning"; // Orange color for greater than 1/3 but less than 2/3
    } else {
      return "danger"; // Red color for 2/3 or greater
    }
  };

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
                  <Form.Label>
                    Position Size{" "}
                    <Button
                      onClick={() =>
                        handlePositionSizeModalShow("Position Size")
                      }
                    >
                      <Icon.QuestionCircle />
                    </Button>
                  </Form.Label>
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
                  <Form.Label>
                    Number of Grid Lines{" "}
                    <Button
                      onClick={() =>
                        handlePositionSizeModalShow("Number of Grid Lines")
                      }
                    >
                      <Icon.QuestionCircle />
                    </Button>
                  </Form.Label>
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
                  <Form.Label>
                    Grid Size{" "}
                    <Button
                      onClick={() => handlePositionSizeModalShow("Grid Size")}
                    >
                      <Icon.QuestionCircle />
                    </Button>
                  </Form.Label>
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
              <Modal
                show={showPositionSizeModal}
                onHide={handlePositionSizeModalClose}
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>{positionSizeLabel}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {positionSizeLabel === "Position Size" && (
                    <>
                      <h4>Safe Position Sizes</h4>
                      <p>
                        {`In Grid Trading strategies, determining a safe position
                        size is crucial for a sustainable and prudent approach.
                        A safe position size refers to the amount of capital
                        allocated to each individual trade within the strategy.
                        To minimize risk and protect your trading capital, it is
                        generally recommended to start with a conservative
                        position size. A good starting point is to allocate a
                        small percentage of your total trading capital,
                        typically ranging from 1% to 5%. By keeping the position
                        size small, you can effectively manage risk and mitigate
                        the impact of adverse market movements.`}
                      </p>
                      <h4>Riskier Position Size and Potential Trade-Offs:</h4>
                      <p>
                        {`While it may be tempting to increase the position size
                        in hopes of larger profits, it's important to understand
                        the trade-offs associated with riskier positions. When
                        you deviate from the safe position size range, you
                        introduce higher levels of risk. Larger positions
                        amplify both gains and losses, meaning that while you
                        may achieve higher profitability in favorable market
                        conditions, you also expose yourself to greater downside
                        risk. It's crucial to carefully evaluate your risk
                        tolerance and consider implementing robust risk
                        management strategies before opting for riskier position
                        sizes.`}
                      </p>
                      <h4>Recommended Position Size Values:</h4>
                      <p>
                        {`The optimal position size for Grid Trading strategies
                        depends on various factors, including your risk
                        tolerance, trading capital, and prevailing market
                        conditions. As a general guideline, starting with a safe
                        position size within the range of 1% to 5% is advisable.
                        This approach allows for diversification across multiple
                        trades and helps mitigate the impact of individual
                        trades on your overall portfolio. It is important to
                        remember that position sizing should be aligned with
                        your risk management strategy and overall investment
                        goals. As you gain experience and become familiar with
                        the performance of your strategy, you can consider
                        adjusting the position size. However, it's crucial to
                        evaluate potential risks and rewards carefully and
                        closely monitor trade performance to ensure the
                        continued viability of your strategy.`}
                      </p>
                    </>
                  )}
                  {positionSizeLabel === "Number of Grid Lines" && (
                    <>
                      <h4>
                        Safe Number of Grid Lines for Grid Trading Strategies:
                      </h4>
                      <p>
                        {`In Grid Trading strategies, determining the number of
                        Grid Lines is an important aspect of the
                        trading plan. The Grid Lines determine the
                        spacing between the different price levels at which
                        trades are executed. When it comes to a safe strategy,
                        it is generally recommended to start with a conservative
                        number of Grid Lines. A lower number,
                        typically between 1 and 5, provides a narrower price
                        range for trade execution and allows for more precise
                        control over the positions taken. This conservative
                        approach helps to minimize the potential impact of
                        market volatility and reduces the exposure to sudden
                        price fluctuations.`}
                      </p>
                      <h4>
                        Riskier Number of Grid Lines and Potential Trade-Offs:
                      </h4>
                      <p>
                        {`While it may be tempting to increase the number of 
                        Grid Lines to capture a wider price range and
                        potentially generate higher profits, it's important to
                        understand the associated risks. A higher number of Grid
                        Lines introduces a greater number of trading
                        opportunities but also increases the complexity and
                        potential risks of the strategy. With a larger number of
                        Grid Lines, there is an increased likelihood of more
                        open positions and a higher exposure to market
                        movements. This can lead to increased drawdowns and
                        potentially higher risk if market conditions are
                        unfavorable.`}
                      </p>
                      <h4>Recommended Number of Grid Lines:</h4>
                      <p>
                        {`The optimal number of Grid Lines in Grid
                        Trading strategies depends on various factors, including
                        market conditions, asset volatility, and your risk
                        appetite. As a general recommendation, starting with a
                        conservative number of Grid Lines,
                        typically between 1 and 5, is advisable. This allows for
                        a more controlled and manageable approach to the
                        strategy. With fewer Grid Lines, you can focus on
                        monitoring and adjusting your positions more
                        effectively, reducing the complexity and potential risks
                        associated with a higher number of Grid Lines. It's
                        important to strike a balance between generating trading
                        opportunities and maintaining risk management
                        discipline.`}
                      </p>
                    </>
                  )}
                  {positionSizeLabel === "Grid Size" && (
                    <>
                      <h4>Safe Grid Size</h4>
                      <p>
                        {`The Grid Size plays a crucial role in determining the
                        spacing between each grid level in a Grid Trading
                        strategy. It is important to choose a Grid Size that
                        aligns with your risk management goals and trading
                        style. In a safe strategy, it is generally recommended
                        to start with a conservative Grid Size. A smaller Grid
                        Size, typically between 0.5 and 2, provides tighter
                        price intervals between grid levels, allowing for finer
                        control over trade entries and exits. This conservative
                        approach helps to limit exposure to significant market
                        movements and reduces the potential risk associated with
                        wider price gaps.`}
                      </p>
                      <h4>Riskier Grid Size and Potential Trade-Offs:</h4>
                      <p>
                        {`While it may be tempting to increase the Grid Size to
                        capture larger price movements and potentially generate
                        higher profits, it's important to consider the
                        associated risks. A larger Grid Size introduces wider
                        price intervals between grid levels, which can result in
                        a higher exposure to market volatility. With a larger
                        Grid Size, the strategy becomes more sensitive to price
                        fluctuations, and there is an increased likelihood of
                        more frequent grid level activations. This can lead to
                        more active positions and potentially higher risk if
                        market conditions are unfavorable.`}
                      </p>
                      <h4>Recommended Grid Size:</h4>
                      <p>
                        {`The optimal Grid Size for Grid Trading strategies
                        depends on various factors, including the volatility of
                        the asset being traded, market conditions, and your risk
                        appetite. As a general recommendation, starting with a
                        conservative Grid Size between 0.5 and 2 is advisable
                        for a safe strategy. This allows for tighter control
                        over trade entries and exits, reducing the impact of
                        sudden price movements. A conservative Grid Size
                        provides a balance between capturing profitable
                        opportunities and managing risk. It is important to
                        assess the market conditions and adjust the Grid Size
                        accordingly to adapt to changing dynamics.`}
                      </p>
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={handlePositionSizeModalClose}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
            <Button
              className="settings-button"
              disabled={isStartButtonDisabled}
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
            disabled={isStartButtonDisabled}
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
          <Button
            className="start-bot-button"
            disabled={isStopButtonDisabled}
            onClick={(event) => {
              event.preventDefault();
              // Send signal to backend to start bot
              const payload = { msg: "gridbot", action: "stop" };
              console.log(JSON.stringify(payload));
              botWebSocket.sendMessage(JSON.stringify(payload));
            }}
          >
            End Bot
          </Button>
          <ProgressBar
            striped
            variant={calculateProgressBarVariant()}
            now={calculateProgressBarPercentage()}
            label="Risk Level"
            style={{ marginTop: "10px" }}
          />
        </Col>
        <Col>
          <CurrentTrades />
        </Col>
      </Row>
      <Row>
        <Col>
          <QuotesTable quotesInfo={quotesInfo} />
          <TradesTable tradesInfo={tradesInfo} />
          <OpenOrdersTable openOrders={openOrders} />
          <ClosedOrdersTable closedOrders={closedOrders} close={lastClose} />
        </Col>
      </Row>
    </Container>
  );
}
