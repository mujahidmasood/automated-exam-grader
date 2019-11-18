import json

from src.grader import AutoGrader
from flask import Flask, request, jsonify

app = Flask(__name__)

"""This file serves the purpose of RESTful API.
It is used by ExamAutoGraderService. Input of request is the image url and coordinates to look for the data.
Response is either empty text or the text identified by the different API 
e.g (Google Cloud Vision API and Publicly available dataset by Github/Breta01)
"""

""" Tests if the services is working properly or not"""


@app.route('/')
def hello_world():
    return 'Hello World!'


""" Gets the text from given image on specified coordinates.
"""


@app.route('/getTextFromImage', methods=['POST'])
def get_text_from_image():
    data = request.data
    data_dict = json.loads(data)

    image_url = data_dict["image_url"]
    text_coordinates = data_dict["text_coordinates"]

    # uncomment line below if you want to work with google api
    extracted_text = AutoGrader().get_text_from_image_google(image_url, text_coordinates)

    # uncomment below if you want to work with publicly trained dataset from github/Breta01
    # extracted_text = AutoGrader().get_text_from_image_public(image_url, text_coordinates)
    app.logger.error("extracted_text = %s ", extracted_text)
    return extracted_text


"""Future method if parallelism is introduced, serial way can use this method"""


@app.route('/processExamSheetSerial', methods=['POST'])
def process_exam_sheet_serial():
    data = request.data
    data_dict = json.loads(data)
    exam = data_dict['requestBody']
    AutoGrader().process_exam_sheet_serial(exam)
    return jsonify(exam)


@app.route('/hello', methods=['POST'])
def hello_service():
    data = request.data
    data_dict = json.loads(data)
    exam = data_dict['requestBody']
    print("exam ", exam)
    response = AutoGrader().hello(exam)
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
