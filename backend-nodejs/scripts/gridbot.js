const API_KEY= "" // PUT YOUR KEY HERE
const SECRET_KEY= ""

const url = "wss://stream.data.alpaca.markets/v1beta3/crypto/us"
const webSocket = new WebSocket(url)

webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const message = data[0]['msg']
    console.log(data)

    if (message === 'connected') {
        console.log("Requesting Authentication")
        sendAuthentication()
    } else if (message === 'authenticated') {
        console.log("Authentication Successful!")
        sendSubscription()
    } else if (message === 'auth failed') {
        console.log("Authentication Failed")
    } else if (message === 'auth timeout') {
        console.log("Authentication Timed Out")
    }
}

const sendAuthentication = () => {
    const authMessage = {"action": "auth", "key": API_KEY, "secret": SECRET_KEY}
    webSocket.send(JSON.stringify(authMessage))
}

const sendSubscription = () => {
    const subscribeMessage = {"action":"subscribe","trades":["ETH/USD"],"quotes":["ETH/USD"],"bars":["ETH/USD"]}
    webSocket.send(JSON.stringify(subscribeMessage))
}