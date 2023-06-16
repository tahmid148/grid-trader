import { useEffect, useRef, useState } from "react";
import "./Test.css";
import { ColorType, CrosshairMode, createChart } from "lightweight-charts";

const Test = (props) => {
  const [historicalData, setHistoricalData] = useState([]);
  const chartContainerRef = useRef(null);
  const candleSeriesRef = useRef(null); // Declare candleSeries as a ref

  var data = [
    { time: "2018-10-19", open: 54.62, high: 55.5, low: 54.52, close: 54.9 },
    { time: "2018-10-22", open: 55.08, high: 55.27, low: 54.61, close: 54.98 },
    { time: "2018-10-23", open: 56.09, high: 57.47, low: 56.09, close: 57.21 },
    { time: "2018-10-24", open: 57.0, high: 58.44, low: 56.41, close: 57.42 },
    { time: "2018-10-25", open: 57.46, high: 57.63, low: 56.17, close: 56.43 },
    { time: "2018-10-26", open: 56.26, high: 56.62, low: 55.19, close: 55.51 },
    { time: "2018-10-29", open: 55.81, high: 57.15, low: 55.72, close: 56.48 },
    { time: "2018-10-30", open: 56.92, high: 58.8, low: 56.92, close: 58.18 },
    { time: "2018-10-31", open: 58.32, high: 58.32, low: 56.76, close: 57.09 },
    { time: "2018-11-01", open: 56.98, high: 57.28, low: 55.55, close: 56.05 },
    { time: "2018-11-02", open: 56.34, high: 57.08, low: 55.92, close: 56.63 },
    { time: "2018-11-05", open: 56.51, high: 57.45, low: 56.51, close: 57.21 },
    { time: "2018-11-06", open: 57.02, high: 57.35, low: 56.65, close: 57.21 },
    { time: "2018-11-07", open: 57.55, high: 57.78, low: 57.03, close: 57.65 },
    { time: "2018-11-08", open: 57.7, high: 58.44, low: 57.66, close: 58.27 },
    { time: "2018-11-09", open: 58.32, high: 59.2, low: 57.94, close: 58.46 },
    { time: "2018-11-12", open: 58.84, high: 59.4, low: 58.54, close: 58.72 },
    { time: "2018-11-13", open: 59.09, high: 59.14, low: 58.32, close: 58.66 },
    { time: "2018-11-14", open: 59.13, high: 59.32, low: 58.41, close: 58.94 },
    { time: "2018-11-15", open: 58.85, high: 59.09, low: 58.45, close: 59.08 },
    { time: "2018-11-16", open: 59.06, high: 60.39, low: 58.91, close: 60.21 },
    { time: "2018-11-19", open: 60.25, high: 61.32, low: 60.18, close: 60.62 },
    { time: "2018-11-20", open: 61.03, high: 61.58, low: 59.17, close: 59.46 },
    { time: "2018-11-21", open: 59.26, high: 59.9, low: 58.88, close: 59.16 },
    { time: "2018-11-23", open: 58.86, high: 59.0, low: 58.29, close: 58.64 },
    { time: "2018-11-26", open: 58.64, high: 59.51, low: 58.31, close: 59.17 },
    { time: "2018-11-27", open: 59.21, high: 60.7, low: 59.18, close: 60.65 },
    { time: "2018-11-28", open: 60.7, high: 60.73, low: 59.64, close: 60.06 },
    { time: "2018-11-29", open: 59.42, high: 59.79, low: 59.26, close: 59.45 },
    { time: "2018-11-30", open: 59.57, high: 60.37, low: 59.48, close: 60.3 },
    { time: "2018-12-03", open: 59.5, high: 59.75, low: 57.69, close: 58.16 },
    { time: "2018-12-04", open: 58.1, high: 59.4, low: 57.96, close: 58.09 },
    { time: "2018-12-06", open: 58.18, high: 58.64, low: 57.16, close: 58.08 },
    { time: "2018-12-07", open: 57.91, high: 58.43, low: 57.34, close: 57.68 },
    { time: "2018-12-10", open: 57.8, high: 58.37, low: 56.87, close: 58.27 },
    { time: "2018-12-11", open: 58.77, high: 59.4, low: 58.63, close: 58.85 },
    { time: "2018-12-12", open: 57.79, high: 58.19, low: 57.23, close: 57.25 },
    { time: "2018-12-13", open: 57.0, high: 57.5, low: 56.81, close: 57.09 },
    { time: "2018-12-14", open: 56.95, high: 57.5, low: 56.75, close: 57.08 },
    { time: "2018-12-17", open: 57.06, high: 57.31, low: 55.53, close: 55.95 },
    { time: "2018-12-18", open: 55.94, high: 56.69, low: 55.31, close: 55.65 },
    { time: "2018-12-19", open: 55.72, high: 56.92, low: 55.5, close: 55.86 },
    { time: "2018-12-20", open: 55.92, high: 56.01, low: 54.26, close: 55.07 },
    { time: "2018-12-21", open: 54.84, high: 56.53, low: 54.24, close: 54.92 },
    { time: "2018-12-24", open: 54.68, high: 55.04, low: 52.94, close: 53.05 },
    { time: "2018-12-26", open: 53.23, high: 54.47, low: 52.4, close: 54.44 },
    { time: "2018-12-27", open: 54.31, high: 55.17, low: 53.35, close: 55.15 },
    { time: "2018-12-28", open: 55.37, high: 55.86, low: 54.9, close: 55.27 },
    { time: "2018-12-31", open: 55.53, high: 56.23, low: 55.07, close: 56.22 },
    { time: "2019-01-02", open: 56.16, high: 56.16, low: 55.28, close: 56.02 },
    { time: "2019-01-03", open: 56.3, high: 56.99, low: 56.06, close: 56.22 },
    { time: "2019-01-04", open: 56.49, high: 56.89, low: 55.95, close: 56.36 },
    { time: "2019-01-07", open: 56.76, high: 57.26, low: 56.55, close: 56.72 },
    { time: "2019-01-08", open: 57.27, high: 58.69, low: 57.05, close: 58.38 },
    { time: "2019-01-09", open: 57.68, high: 57.72, low: 56.85, close: 57.05 },
    { time: "2019-01-10", open: 57.29, high: 57.7, low: 56.87, close: 57.6 },
    { time: "2019-01-11", open: 57.84, high: 58.26, low: 57.42, close: 58.02 },
    { time: "2019-01-14", open: 57.83, high: 58.15, low: 57.67, close: 58.03 },
    { time: "2019-01-15", open: 57.74, high: 58.29, low: 57.58, close: 58.1 },
    { time: "2019-01-16", open: 57.93, high: 57.93, low: 57.0, close: 57.08 },
    { time: "2019-01-17", open: 57.16, high: 57.4, low: 56.21, close: 56.83 },
    { time: "2019-01-18", open: 56.92, high: 57.47, low: 56.84, close: 57.09 },
    { time: "2019-01-22", open: 57.23, high: 57.39, low: 56.4, close: 56.99 },
    { time: "2019-01-23", open: 56.98, high: 57.87, low: 56.93, close: 57.76 },
    { time: "2019-01-24", open: 57.61, high: 57.65, low: 56.5, close: 57.07 },
    { time: "2019-01-25", open: 57.18, high: 57.47, low: 56.23, close: 56.4 },
    { time: "2019-01-28", open: 56.12, high: 56.22, low: 54.8, close: 55.07 },
    { time: "2019-01-29", open: 53.62, high: 54.3, low: 52.97, close: 53.28 },
    { time: "2019-01-30", open: 53.1, high: 54.02, low: 52.28, close: 54.0 },
    { time: "2019-01-31", open: 54.05, high: 55.19, low: 53.53, close: 55.06 },
    { time: "2019-02-01", open: 55.21, high: 55.3, low: 54.47, close: 54.55 },
    { time: "2019-02-04", open: 54.6, high: 54.69, low: 53.67, close: 54.04 },
    { time: "2019-02-05", open: 54.1, high: 54.34, low: 53.61, close: 54.14 },
    { time: "2019-02-06", open: 54.11, high: 54.37, low: 53.68, close: 53.79 },
    { time: "2019-02-07", open: 53.61, high: 53.73, low: 53.02, close: 53.57 },
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

  return <div ref={chartContainerRef} />;
};

export default Test;
