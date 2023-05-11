import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef } from "react";

const Chart = (data) => {
  const chartContainerRef = useRef(null);
  let initialised = false;

  useEffect(() => {
    if (!initialised) {
      initialised = true;
      const chart = createChart(chartContainerRef.current, {
        width: 600,
        height: 300,
        layout: {
          background: {
            type: ColorType.Solid,
            color: "#000000",
          },
        },
      });

      var candleSeries = chart.addCandlestickSeries();
    }
  });

  return <div ref={chartContainerRef}></div>;
};

export default Chart;
