import axios from "axios";
import { useState } from "react";

const Dashboard = () => {
  var start = new Date(Date.now() - 7200 * 1000).toISOString(); // 2 hours ago
  var symbol = "ETH/USD";
  var timeframe = "1Min";
  var bars_URL = `https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols=${symbol}&timeframe=${timeframe}&start=${start}`;

  const getBars = async (_symbol, _auth_token) => {
    const response = await axios.get(bars_URL, {
      headers: {
        Authorization: `Bearer ${_auth_token}`,
      },
      params: {},
    });
    if (response.status === 200) {
      const responseData = response.data.bars[symbol];
      const lightweightChartsHistoricalData = responseData.map((bar) => {
        return {
          open: bar.o,
          high: bar.h,
          low: bar.l,
          close: bar.c,
          time: Date.parse(bar.t) / 1000, // Converts ISO 8601 to Unix timestamp
        };
      });
    }
  };

  getBars("ETH/USD", process.env.REACT_APP_AUTH_TOKEN);

  return <></>;
};

export default Dashboard;
