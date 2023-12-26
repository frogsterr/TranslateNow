'''
import asyncio
import websockets
from decoder import dataToImage

 
async def handle_socket(websocket):
    async for message in websocket:
        dataToImage(message)
        print(f"Received message: {message}")

        response = "Message Received!"
        await websocket.send(response)

async def main():
    async with websockets.serve(handle_socket, "localhost", 8079):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
    '''
import asyncio
import websockets
from decoder import dataToImage

async def handle_socket(websocket):
    frame_count = 0
    start_time = asyncio.get_event_loop().time()

    async for message in websocket:
        dataToImage(message)
        #print(f"Received message: {message}")

        response = "Message Received!"
        await websocket.send(response)

        # Update FPS counter
        frame_count += 1
        current_time = asyncio.get_event_loop().time()
        elapsed_time = current_time - start_time

        if elapsed_time >= 1.0:  # Update FPS every second
            fps = frame_count / elapsed_time
            print(f"FPS: {fps:.2f}")
            frame_count = 0
            start_time = current_time

async def main():
    async with websockets.serve(handle_socket, "localhost", 8079):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())

