import axios from "axios";
import Chart from "./Chart";
import { useEffect, useState } from "react";

const getBars = async () => {
  const symbol = "ETH/USDT";
  const timeframe = "1Min";
  const limit = 10000;

  const end = new Date().toISOString(); // Current date and time
  const start = new Date();
  start.setHours(start.getHours() - 12); // Subtract 12 hours

  const baseUrl = "https://data.alpaca.markets/v1beta2/crypto/bars";
  const symbolsParam = encodeURIComponent(symbol);
  const timeframeParam = encodeURIComponent(timeframe);
  const startParam = `&start=${start.toISOString()}`;
  const endParam = `&end=${end}`;
  const limitParam = limit ? `&limit=${limit}` : "";

  const url = `${baseUrl}?symbols=${symbolsParam}&timeframe=${timeframeParam}${startParam}${endParam}${limitParam}`;

  const response = await axios.get(url);
  const data = response.data;

  console.log("DATAAAAAAA");
  console.log(data);

  const bars = data.bars[symbol].map((bar) => ({
    open: bar.o,
    high: bar.h,
    low: bar.l,
    close: bar.c,
    time: new Date(bar.t).getTime() / 1000, // Converts to UNIX timestamp
  }));

  return bars;
};

const Dashboard = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [isHistoricalLoading, setIsHistoricalLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBars();
      setHistoricalData(data);
      setIsHistoricalLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>ETH/USDT</h1>
      <Chart data={historicalData} />
    </>
  );
};

export default Dashboard;
