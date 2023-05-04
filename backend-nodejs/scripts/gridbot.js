
const url = "wss://stream.data.alpaca.markets/v1beta3/crypto/us"
const webSocket = new WebSocket(url)

console.log(webSocket)

webSocket.onmessage = (event) => {
    console.log(event)
}