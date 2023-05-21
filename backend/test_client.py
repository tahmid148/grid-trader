import json
import websocket


# Connect to websocket server
ws = websocket.WebSocket()
ws.connect("ws://localhost:9001/")
print("Connected to websocket server")

# Wait for messages
while True:
    message = json.loads(ws.recv())
    print("Received message:", message["fb"])
    # Process the message or perform any other necessary actions
