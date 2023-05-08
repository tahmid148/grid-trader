const API_KEY= "AKXXEXUBUX0WATW7WC28" // PUT YOUR KEY HERE
const SECRET_KEY= "5mhAaEF7CwL26C4wCQ7Ww58pyVXfyyaiY35rwixI"

const url = "wss://stream.data.alpaca.markets/v1beta3/crypto/us"
const webSocket = new WebSocket(url)

const quotesElement = document.getElementById('quotes')
const tradesElement = document.getElementById('trades')


webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const message = data[0]['msg']

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

    for (var key in data) {
        const type  = data[key].T

        if (type === 'q') {
            console.log("Got a QUOTE")
            console.log(data[key])

            const quoteElement = document.createElement('div');
            quoteElement.className = 'quote'
            quoteElement.innerHTML = `<b>${data[key].t}</b> ${data[key].bp} ${data[key].ap}`
            quotesElement.appendChild(quoteElement)

            var elements = document.getElementsByClassName('quote')
            if (elements.length > 10) {
                quotesElement.removeChild(elements[0])
            }

        } else if (type === 't') {
            console.log("Got a TRADE")
            console.log(data[key])

            const tradeElement = document.createElement('div');
            tradeElement.className = 'trade'
            tradeElement.innerHTML = `<b>${data[key].t}</b> ${data[key].p} ${data[key].s}`
            tradesElement.appendChild(tradeElement)

            var elements = document.getElementsByClassName('trade')
            if (elements.length > 10) {
                tradesElement.removeChild(elements[0])
            }
        } else if (type === 'b') {
            console.log("Got a new BAR")
            console.log(data[key])
        }
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