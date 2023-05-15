from fastapi import FastAPI, WebSocket
from typing import List

app = FastAPI()

connected_clients: List[WebSocket] = []


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # Accept the WebSocket connection
    await websocket.accept()

    # Add the WebSocket to the list of connected clients
    connected_clients.append(websocket)

    try:
        while True:
            # Wait for a message from the client
            data = await websocket.receive_text()

            # Send the message to all connected clients
            for (index, client) in enumerate(connected_clients):
                await client.send_text(f"Client {index} says: {data}")
    except Exception as e:
        print(f"WebSocket connection error: {e}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=9001)
