import os

import cv2
import matplotlib.pyplot as plt

"""Crops the coordinates from the given image. Output is in form of (x,y,w,h)
Output is shown in console.
"""

if __name__ == '__main__':
    HERE = os.path.dirname(os.path.abspath(__file__))
    print(HERE)
    image_url = os.path.join(HERE, './test/test.jpg')
    img1 = cv2.imread(image_url)
    fromCenter = False
    r = cv2.selectROI("Image", img1, fromCenter)
    print(r)
