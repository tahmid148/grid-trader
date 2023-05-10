import { createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

const Chart = ({ data }) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    // Create new chart instance
    const chart = createChart(chartContainerRef.current, {
      width: 600,
      height: 300,
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
