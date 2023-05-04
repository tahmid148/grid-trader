const API_KEY= "" // PUT YOUR KEY HERE
const SECRET_KEY= "" 

const url = "wss://stream.data.alpaca.markets/v1beta3/crypto/us"
const webSocket = new WebSocket(url)

console.log(webSocket)

webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log(data)

    if (data[0]['msg'] === 'connected') {
        console.log("Requesting Authentication")
        sendAuthentication()
    } else if (data[0]['msg'] === 'authenticated') {
        console.log("Authentication Successful!")
    } else {
        console.log("Authentication Failed")
    }
}

const sendAuthentication = () => {
    const authMessage = {"action": "auth", "key": process.env.API_KEY, "secret": process.env.SECRET_KEY}

    console.log(`This is the message: ${authMessage}`)
    webSocket.send(JSON.stringify(authMessage))
}