# -*- coding: utf-8 -*-
"""
Helper functions for ocr project
"""
import configparser
import os

import cv2
import matplotlib.pyplot as plt
import numpy as np

from src.tfhelpers import Model

SMALL_HEIGHT = 800


def implt(img, cmp=None, t=''):
    """Show image using plt."""
    plt.imshow(img, cmap=cmp)
    plt.title(t)
    plt.show()


def resize(img, height=SMALL_HEIGHT, allways=False):
    """Resize image to given height."""
    if (img.shape[0] > height or allways):
        rat = height / img.shape[0]
        return cv2.resize(img, (int(rat * img.shape[1]), height))

    return img


def ratio(img, height=SMALL_HEIGHT):
    """Getting scale ratio."""
    return img.shape[0] / height


def img_extend(img, shape):
    """Extend 2D image (numpy array) in vertical and horizontal direction.
    Shape of result image will match 'shape'
    Args:
        img: image to be extended
        shape: shape (touple) of result image
    Returns:
        Extended image
    """
    x = np.zeros(shape, np.uint8)
    x[:img.shape[0], :img.shape[1]] = img
    return x


def get_cnn_model():
    config = read_property()
    location = config.get('MachineLearningSection', "cnn_model")
    dir_path = os.path.dirname(os.path.realpath(__file__))
    cnn_model = Model(dir_path + location)
    return cnn_model


def get_rnn_model():
    config = read_property()
    location = config.get('MachineLearningSection', "rnn_model")
    dir_path = os.path.dirname(os.path.realpath(__file__))
    rnn_model = Model(dir_path + location, 'prediction')
    return rnn_model


def read_property():
    """Returns the value associated to given property name in properties.cfg file"""
    config = configparser.RawConfigParser()
    config.read(filenames='./properties.cfg', encoding=None)
    return config
