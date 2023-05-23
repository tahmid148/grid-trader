import json
from websocket_server import WebsocketServer

backend_clients = []
frontend_clients = []


def assign_client_type(client, message_json):
    if message_json['client_type'] == 'backend':
        backend_clients.append(client)
        print("Backend client connected")
    elif message_json['client_type'] == 'frontend':
        frontend_clients.append(client)
        print("Frontend client connected")


def send_message_to_frontend(message):
    print("Sending message to frontend")
    for client in frontend_clients:
        server.send_message(client, json.dumps(message))


def send_message_to_backend(message):
    print("Sending message to backend")
    for client in backend_clients:
        server.send_message(client, json.dumps(message))


def new_client(client, server):
    print("New client connected and was given id %d" % client['id'])


def message_received(client, server, message):
    try:
        message_json = json.loads(message)
        if "client_type" in message_json:
            assign_client_type(client, message_json)
        elif client in frontend_clients:
            send_message_to_backend(message_json)
        elif client in backend_clients:
            send_message_to_frontend(message_json)
    except json.decoder.JSONDecodeError:
        print("Message not JSON")

    # print("Client(%d) said: %s" % (client['id'], message))


PORT = 9001
server = WebsocketServer(port=PORT)
server.set_fn_new_client(new_client)
server.set_fn_message_received(message_received)
server.run_forever()
