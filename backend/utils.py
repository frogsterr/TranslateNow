import base64
from PIL import Image
from io import BytesIO
import mediapipe as mp
import numpy as np

def dataToImage(base64_string, output_path='output.jpg'):
    try:
        # Decode the base64 string
        image_data = base64.b64decode(base64_string)

        #image_array = np.frombuffer(image_data, dtype=np.uint8)

        # Open the image using PIL
        image = Image.open(BytesIO(image_data))

        # Save the image to a file
        image.save(output_path, 'JPEG')

        print(f"Image saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

class HandTracker():
    def __init__(self) -> None:
        self.hands = mp.solutions.hands.Hands()
    def results(self, img):
        return self.hands.process(img)