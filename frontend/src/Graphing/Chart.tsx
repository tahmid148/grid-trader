import { ColorType, CrosshairMode, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";
// import Alpaca from "@alpacahq/alpaca-trade-api";

const Chart = () => {
  const chartContainerRef = useRef(null);
  const API_KEY = process.env.API_KEY;
  const SECRET_KEY = process.env.SECRET_KEY;

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
