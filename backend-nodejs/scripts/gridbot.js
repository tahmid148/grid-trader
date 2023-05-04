
const url = "wss://stream.data.alpaca.markets/v1beta3/crypto/us"
const webSocket = new WebSocket(url)

console.log(webSocket)

webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log(data)

    if (data[0]['msg'] === 'connected') {
        console.log("Do Authentication")
    } else {
        console.log("Authentication Failed")
    }
}