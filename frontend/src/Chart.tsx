import { ColorType, CrosshairMode, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

const Chart = ({ data }) => {
  const chartContainerRef = useRef(null);

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
