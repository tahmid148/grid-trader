import axios from "axios";

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
    console.log(response);
  };

  getBars("ETH/USD", process.env.REACT_APP_AUTH_TOKEN);

  return <></>;
};

export default Dashboard;
