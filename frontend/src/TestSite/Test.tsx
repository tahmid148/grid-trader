import { useEffect, useRef, useState } from "react";
import "./Test.css";
import {
  ColorType,
  CrosshairMode,
  LineStyle,
  createChart,
} from "lightweight-charts";

const Test = (props) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [data, setData] = useState([]);
  const chartContainerRef = useRef(null);
  const candleSeriesRef = useRef(null); // Declare candleSeries as a ref
  const [path, setPath] = useState("./ETHUSDT.csv");

  const orders = [
    { price: 1600, side: "BUY" },
    { price: 200, side: "SELL" },
  ];

  const {
    colors: {
      backgroundColor = "white",
      lineColor = "#2962FF",
      textColor = "black",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
  } = props;

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
      width: window.innerWidth,
      height: window.innerHeight,
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(path);
      const csvData = await response.text();

      const rows = csvData.trim().split("\n");
      const parsedData = [];

      for (let i = 1; i < rows.length; i++) {
        const [time, open, high, low, close, volume, ...rest] =
          rows[i].split(",");

        console.log(time);

        parsedData.push({
          open: Number(open),
          high: Number(high),
          low: Number(low),
          close: Number(close),
          time: new Date(Number(time)).getTime() / 1000,
          // Include additional fields if needed
        });
      }

      setData(parsedData);
    };

    fetchData();
  }, [path]);

  useEffect(() => {
    orders.forEach((order) => {
      const priceLine = {
        price: order.price,
        color: order.side === "BUY" ? "#00ff00" : "#ff0000",
        lineWidth: 1,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
        title: order.side,
      };
      var line = candleSeriesRef.current.createPriceLine(priceLine);
    });
  }, [orders]);

  // const priceLine = {
  //   price: parseFloat(order.price),
  //   color: order.side === "BUY" ? "#00ff00" : "#ff0000",
  //   lineWidth: 1,
  //   lineStyle: LineStyle.Solid,
  //   axisLabelVisible: true,
  //   title: order.side,
  // };
  // var line = candleSeriesRef.current.createPriceLine(priceLine);

  return <div ref={chartContainerRef} />;
};

export default Test;
