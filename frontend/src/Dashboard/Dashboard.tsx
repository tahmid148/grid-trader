import axios from "axios";
import Chart from "./Chart";
import { useEffect, useState } from "react";

const getBars = async () => {
  const start = new Date(Date.now() - 7200 * 1000).toISOString(); // 2 hours ago
  const symbol = "ETH/USD";
  const timeframe = "1Min";
  const bars_URL = `https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols=${symbol}&timeframe=${timeframe}&start=${start}`;

  const response = await axios.get(bars_URL, {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
    },
  });

  const data = response.data.bars[symbol].map((bar) => ({
    open: bar.o,
    high: bar.h,
    low: bar.l,
    close: bar.c,
    time: new Date(bar.t).getTime() / 1000, // Converts to UNIX timestamp
  }));

  return data;
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBars();
      setData(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      <Chart data={data} />
    </>
  );
};

export default Dashboard;
