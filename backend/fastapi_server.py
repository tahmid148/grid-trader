from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
import connection_manager

app = FastAPI()

manager = connection_manager.ConnectionManager()


@app.websocket("/")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("A client has left the chat")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=9001)
