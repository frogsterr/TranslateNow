
import asyncio
import websockets

async def handle_socket(websocket, path):
    async for message in websocket:
        print(f"Received message: {message}")

        response = "Message Received!"
        await websocket.send(response)

async def main():
    async with websockets.serve(handle_socket, "localhost", 8079):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
