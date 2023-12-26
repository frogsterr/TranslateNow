import base64
from PIL import Image
from io import BytesIO

def dataToImage(base64_string, output_path='output.jpg'):
    try:
        # Decode the base64 string
        image_data = base64.b64decode(base64_string)

        # Open the image using PIL
        image = Image.open(BytesIO(image_data))

        # Save the image to a file
        image.save(output_path, 'JPEG')

        print(f"Image saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")


