from flask import Flask, request, jsonify

app = Flask(__name__)
import os

import cv2
from pathlib import Path

from google.cloud import vision
from google.cloud.vision import types
import io
import time
import imageio

try:
    import Image
except ImportError:
    from PIL import Image


class AutoGrader:
    body = []
    slider = (60, 2)

    """  Gets the text from given image.
            Google Cloud Vision API is used to extract the text.
            Public and private keys along with JSON settings should be installed for this method to work properly.
            Image is first cropped using the given coordinates (Only the cropped section of student's handwriting is sent to google server).
        """

    def get_text_from_image_google(self, image_url, text_coordinates):
        """ Identify the section from where answer should start"""

        text_coordinates_list = [int(e) if e.isdigit() else e for e in text_coordinates.split(',')]
        app.logger.error("text_coordinates_list = %s ", text_coordinates_list)
        r0, r1, r2, r3 = text_coordinates_list

        app.logger.error("image_url : %s ", image_url)

        path, filename = os.path.split(image_url)
        app.logger.error("path : %s, filename: %s ", path, filename)

        student_answer = ''
        image = cv2.imread(image_url, cv2.COLOR_BGR2RGB)
        if image is not None:
            img = image[int(r1): (int(r1) + int(r3)), int(r0): (int(r0) + int(r2))]

            dirName = 'cropped'

            if not os.path.exists(path + "/" + dirName):
                os.mkdir(path + "/" + dirName)
                print("Directory ", dirName, " Created ")

            temp_url = path + "/" + dirName + "/" + time.strftime("%d%s") + ".jpg"

            app.logger.error("temp_url : %s ", temp_url)
            imageio.imwrite(temp_url, img)
            client = vision.ImageAnnotatorClient()
            with io.open(temp_url, 'rb') as image_file:
                content = image_file.read()
                image = types.Image(content=content)
                res = client.text_detection(image=image)
                texts = res.text_annotations

                for text in texts:
                    student_answer = text.description

        return student_answer

    def process_exam_sheet_serial(self, exam):
        inputExamSheetsDirectory = exam['inputExamSheetsDirectory']
        home_directory = str(Path.home())
        exam_sheets_directory = home_directory + "/" + inputExamSheetsDirectory
        answer_sheet_images = self.listdir_nohidden(exam_sheets_directory)
        for image in answer_sheet_images:
            matriculation_no = exam['matriculationNo']
            semester = exam['semester']
            course = exam['course']
            questions = exam['questions']
            year = exam['year']
            image_url = exam_sheets_directory + "/" + image
            grade_details = self.auto_grade(image_url, questions, matriculation_no, semester, course, year)
            print('grade_details', grade_details)

    """ Test Service to check if Falsk rest service is working"""

    def hello(self, arg):
        return arg + 'back'
