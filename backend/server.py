import asyncio
import websockets
from utils import dataToImage, HandTracker
import cv2

hands = HandTracker()

async def handle_socket(websocket):
    frame_count = 0
    start_time = asyncio.get_event_loop().time()

    async for message in websocket:
        dataToImage(message)
        img = cv2.imread("output.jpg")
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGRA2RGB)
        res = hands.results(imgRGB)
        if res.multi_hand_landmarks:
            for lm in res.multi_hand_landmarks:
                print(f"this is one individual lm: {lm.landmark}")
                #for id, lm in enumerate(lm.landmark):
                    #print(f"Here is id: {id}. Here is lm: {lm}")
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

