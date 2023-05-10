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

export { sendAuthentication, sendSubscription };
