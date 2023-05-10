const Alpaca = require("@alpacahq/alpaca-trade-api");

const API_KEY = "AKXXEXUBUX0WATW7WC28";
const SECRET_KEY = "5mhAaEF7CwL26C4wCQ7Ww58pyVXfyyaiY35rwixI";

const alpaca = new Alpaca({
  keyId: API_KEY,
  secretKey: SECRET_KEY,
  paper: true,
});

const options = {
  start: new Date(new Date().setDate(new Date().getDate() - 1)), // 1 day ago
  end: new Date(), // Current date
  timeframe: "1Day",
};

async function getHistoricalBars(symbols) {
  let bars = [];
  try {
    const resp = await alpaca.getCryptoBars(symbols, options);
    for await (let bar of resp) {
      bars.push(bar);
    }
  } catch (error) {
    console.error("Error fetching historical bars:", error);
  }
  return bars;
}

const symbols = ["ETH/USD"]; // Pass symbols as an array
const barsPromise = getHistoricalBars(symbols);
barsPromise.then((bars) =>
  bars.forEach((bar) => {
    console.log(bar);
  })
);

const sendAuthentication = (webSocket, API_KEY, SECRET_KEY) => {
  const authMessage = { action: "auth", key: API_KEY, secret: SECRET_KEY };
  webSocket.send(JSON.stringify(authMessage));
};

const sendSubscription = (webSocket) => {
  const subscribeMessage = {
    action: "subscribe",
    trades: ["ETH/USD"],
    quotes: ["ETH/USD"],
    bars: ["ETH/USD"],
  };
  webSocket.send(JSON.stringify(subscribeMessage));
};

// export { sendAuthentication, sendSubscription };
