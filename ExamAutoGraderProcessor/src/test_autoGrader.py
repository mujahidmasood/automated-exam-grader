from unittest import TestCase
from src.autograder.grader import AutoGrader
import cv2
import os.path
import numpy as np


class TestAutoGrader(TestCase):
    HERE = os.path.dirname(os.path.abspath(__file__))
    IMAGES_DIR = os.path.join(HERE, 'images/')
    image_url = IMAGES_DIR + "11.jpeg"
    grader = AutoGrader()
    image = cv2.imread(image_url)

    def test_valid_image_exists(self):
        """ Checks if image is valid """
        self.assertEqual(type(self.image), np.ndarray)

    def test_write_nothing(self):
        """ student writes nothing => points =0 """
        exam_sheets = [

            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 1,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin"],
                        "points": 1
                    },
                ],
            },
        ]

        cropped_answer = ""
        points = self.grader.process_exam_sheets(self.image, exam_sheets,cropped_answer)
        assert (points == 0)

    def test_write_wrong_answer(self):
        """ student writes wrong keyword => points = 0 """
        exam_sheets = [

            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 1,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin"],
                        "points": 1
                    },
                ],
            },
        ]

        cropped_answer = "123"
        points = self.grader.process_exam_sheets(self.image, exam_sheets, cropped_answer)
        assert (points == 0)

    def test_write_exact_answer(self):
        """ student writes exact keywords = full points """
        exam_sheets = [

            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 1,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin"],
                        "points": 1
                    },
                ],
            },
        ]

        cropped_answer = "cashin"
        points = self.grader.process_exam_sheets(self.image, exam_sheets, cropped_answer)
        assert (points == 1)

    def test_write_correct_but_extra(self):
        """ student writes keywords but extra = full points """
        exam_sheets = [

            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 1,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin"],
                        "points": 1
                    },
                ],
            },
        ]

        cropped_answer = "cashin cashout"
        points = self.grader.process_exam_sheets(self.image, exam_sheets, cropped_answer)
        assert (points == 1)

    def test_write_correct_but_extra(self):
        """ student writes correct keywords but reversed order """
        exam_sheets = [

            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 1,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin cashout"],
                        "points": 2
                    },
                ],
            },
        ]

        cropped_answer = "cashout cashin"
        points = self.grader.process_exam_sheets(self.image, exam_sheets, cropped_answer)
        assert (points == 2)

    def test_write_quarter_correct_keywords(self):
        """ student writes quarter keywords of needed keywords => points /4 """
        exam_sheets = [

            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 1,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin cashout cashfoo cash"],
                        "points": 2
                    },
                ],
            },
        ]

        cropped_answer = "cashout"
        points = self.grader.process_exam_sheets(self.image, exam_sheets, cropped_answer)
        assert (points == 0.5)

    def test_write_half_correct_keywords(self):
        """ student writes half keywords of needed keywords => points / 2 """
        exam_sheets = [

            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 1,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin cashout cashfoo cash"],
                        "points": 2
                    },
                ],
            },
        ]

        cropped_answer = "cashout cash"
        points = self.grader.process_exam_sheets(self.image, exam_sheets, cropped_answer)
        assert (points == 1)

    def test_write_half_correct_keywords(self):
        """ student writes 3/4 keywords of needed keywords => 3/4 points """
        exam_sheets = [

            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 1,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin cashout cashfoo cash"],
                        "points": 2
                    },
                ],
            },
        ]

        cropped_answer = "cashout cash cashfoo"
        points = self.grader.process_exam_sheets(self.image, exam_sheets, cropped_answer)
        assert (points == 1.5)

    def test_write_all_correct_keywords(self):
        """ student writes all keywords of needed keywords => full points """
        exam_sheets = [

            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 1,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin cashout cashfoo cash"],
                        "points": 2
                    },
                ],
            },
        ]

        cropped_answer = "cashout cash cashfoo cashin"
        points = self.grader.process_exam_sheets(self.image, exam_sheets, cropped_answer)
        assert (points == 2)

    def test_write_random_correct_keywords(self):
        """ student writes all keywords of needed keywords => full points """
        exam_sheets = [

            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 1,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin cashout cashfoo cash 1 2 3 4 5 6"],
                        "points": 1
                    },
                ],
            },
        ]

        cropped_answer = "cashout"
        points = self.grader.process_exam_sheets(self.image, exam_sheets, cropped_answer)
        assert (points == 0.1)

    def test_write_stopping_keywords(self):
        """ student writes all keywords of needed keywords => full points """
        exam_sheets = [

            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 1,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin cashout cashfoo cash 1 2 3 4 5 6"],
                        "points": 1
                    },
                ],
            },
        ]

        cropped_answer = "a an der die das , '' . ok notOK well very well cashout 1 ok not ok ...."
        points = self.grader.process_exam_sheets(self.image, exam_sheets, cropped_answer)
        assert (points == 0.2)

    def test_process_exam_sheets(self):
        exam_sheets = [

            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 1,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin"],
                        "points": 1
                    },
                    {
                        "question_no": 2,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin cashout"],
                        "points": 2
                    }
                ],
            },
            {
                "matriculation_no": [108, 186, 926, 286],
                "semester": [208, 187, 926, 286],
                "course": [308, 186, 926, 286],
                "answers": [
                    {
                        "question_no": 3,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin"],
                        "points": 3
                    },
                    {
                        "question_no": 4,
                        "answer_coordinates": [108, 186, 926, 286],
                        "possible_answers": ["cashin cashout"],
                        "points": 4
                    }
                ],
            },

        ]
        self.grader.process_exam_sheets(self.image, exam_sheets, cropped_answer="cashin cashout")
