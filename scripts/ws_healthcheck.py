import sys, websocket, json
url=sys.argv[1]
ws = websocket.create_connection(url, timeout=5)
ws.send(json.dumps({"ping":"health"}))
print(ws.recv())
ws.close() 