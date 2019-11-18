import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AutomatedExamService} from "../../providers/service";
import {AlertController, NavController, NavParams} from "ionic-angular";
import {HomePage} from "../home/home";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {DomSanitizer} from '@angular/platform-browser';
import {PdfViewerPage} from "../pdfViewer/pdf_viewer";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'page-add-exam',
    templateUrl: 'add-exam.html'
})
export class AddExamPage {

    form: FormGroup;
    language: string;
    examSheet: any;
    pdfUrl: any;
    pdfDocGenerator: any = null;
    docDefinition = null;

    constructor(private _FB: FormBuilder,
                private examService: AutomatedExamService,
                private alertController: AlertController,
                private navCtrl: NavController,
                private navParams: NavParams,
                private sanitizer: DomSanitizer) {


        this.examService.changeLanguage('en');
        this.language = this.examService.getCurrentLang();

        if (this.navParams.get('exam')) {
            let exam = this.navParams.get('exam');
            console.log("exam ", exam);

            let newTopics = [];
            exam.topics.forEach((topic) => {
                newTopics.push(this._FB.group({
                    topicName: topic.topicName,
                    topicNumber: topic.topicNumber,
                    topicPoints: topic.topicPoints,
                    topicDescription: topic.topicDescription
                }));
            });

            let newSubTopics = [];
            exam.subTopics.forEach((subTopic) => {
                newSubTopics.push(this._FB.group({
                    subTopicName: subTopic.subTopicName,
                    subTopicNumber: subTopic.subTopicNumber,
                    subTopicPoints: subTopic.subTopicPoints,
                    subTopicDescription: subTopic.subTopicDescription
                }));
            });

            let newQuestions = [];
            exam.questions.forEach((question) => {
                newQuestions.push(this._FB.group({
                    questionNumber: question.questionNumber,
                    possibleAnswers: question.possibleAnswers,
                    points: question.points,
                    answerCoordinates: question.answerCoordinates,
                    questionDescription: question.questionDescription,
                    questionType: question.questionType,
                    isMandatory: question.isMandatory
                }));
            });

            this.form = this._FB.group({
                _id: exam._id,
                language: exam.language,
                course: exam.course,
                instructor: exam.instructor,
                fullName: exam.fullName,
                semester: exam.semester,
                year: exam.year,
                matriculationNo: exam.matriculationNo,
                processed: exam.processed,
                topics: this._FB.array(newTopics),
                subTopics: this._FB.array(newSubTopics),
                questions: this._FB.array(newQuestions)
            });

        } else {
            this.form = this._FB.group({
                _id: null,
                language: this.language,
                course: ['', Validators.required],
                semester: ['', Validators.required],
                year: ['', Validators.required],
                fullName: [''],
                instructor: [''],
                matriculationNo: [''],
                processed: false,
                topics: this._FB.array([
                    this.initTopics()
                ]),
                subTopics: this._FB.array([
                    this.initSubTopics()
                ]),
                questions: this._FB.array([
                    this.initQuestionFields()
                ])
            });
        }
    }

    initTopics(): FormGroup {
        return this._FB.group({
            topicName: '',
            topicNumber: '',
            topicPoints: '',
            topicDescription: ''
        });

    }

    initSubTopics(): FormGroup {
        return this._FB.group({
            subTopicName: '',
            subTopicNumber: '',
            subTopicPoints: '',
            subTopicDescription: ''
        });
    }

    /**
     * Generates a FormGroup object with input field validation rules for
     * the technologies form object
     *
     * @public
     * @method initQuestionFields
     * @return {FormGroup}
     */
    initQuestionFields(): FormGroup {
        return this._FB.group({
            questionNumber: ['', Validators.required],
            possibleAnswers: ['', Validators.required],
            points: ['', Validators.required],
            answerCoordinates: [''],
            questionDescription: ['', Validators.required],
            questionType: [''],
            isMandatory: ['']
        });
    }


    /**
     * Programmatically generates a new technology Questions Section
     *
     * @public
     * @method addQuestionsSection
     * @return {none}
     */
    addQuestionsSection(): void {
        const control = <FormArray>this.form.controls.questions;
        control.push(this.initQuestionFields());
    }

    /**
     * Programmatically generates a new technology Topics Section
     *
     * @public
     * @method addTopicsSection
     * @return {none}
     */
    addTopicsSection(): void {
        const control = <FormArray>this.form.controls.topics;
        control.push(this.initTopics());
    }

    /**
     * Programmatically generates a new Topics Section
     *
     * @public
     * @method addTopicsSection
     * @return {none}
     */
    addSubTopicsSection(): void {
        const control = <FormArray>this.form.controls.subTopics;
        control.push(this.initSubTopics());
    }

    /**
     * Programmatically removes a recently generated questions
     *
     * @public
     * @method removeQuestionsSection
     * @param i    {number}      The position of the object in the array that needs to removed
     * @return {none}
     */
    removeTopicsSection(i: number): void {
        const control = <FormArray>this.form.controls.topics;
        control.removeAt(i);
    }

    /**
     * Programmatically removes a recently generated questions
     *
     * @public
     * @method removeQuestionsSection
     * @param i    {number}      The position of the object in the array that needs to removed
     * @return {none}
     */
    removeQuestionsSection(i: number): void {
        const control = <FormArray>this.form.controls.questions;
        control.removeAt(i);
    }

    /**
     * Programmatically removes a recently generated subTopics
     *
     * @public
     * @method removeSubTopicsSection
     * @param i    {number}      The position of the object in the array that needs to removed
     * @return {none}
     */
    removeSubTopicsSection(i: number): void {
        const control = <FormArray>this.form.controls.subTopics;
        control.removeAt(i);
    }

    /**
     * Receive the submitted form data
     *
     * @public
     * @method saveExamData
     * @param val    {object}      The posted form data
     * @return {none}
     */
    saveExamData(examData: any): void {


        if (this.navParams.get('exam')) {
            let exam = this.navParams.get('exam');
            console.log("exam ", exam);
            examData.id = exam.id;
        }
        console.log("examData to save ", examData);
        let response = this.examService.addExam(examData);
        response.subscribe(
            value => {
                if (value) {
                    this.showAlert()
                }
            },
            error1 => console.log(error1)
        )
    }

    /**
     *
     * @param event
     */
    viewExamPdf(form) {
        console.log("examData", form)
        let data = [];

        form.topics.map(function (topic) {

            data.push(
                {
                    stack: [

                        {
                            canvas: [{
                                type: 'line',
                                x1: 0,
                                y1: 5,
                                x2: 500,
                                y2: 5,
                                lineWidth: 1,
                                lineCap: 'square',
                                alignment: 'justify'
                            }],
                            text: topic.topicNumber.concat("\t\t\t", topic.topicName, "\t\t\t\t\t\t\t\t\t\t", topic.topicPoints),
                            style: 'header',
                            alignment: 'justify'
                        },
                        {
                            canvas: [{
                                type: 'line',
                                x1: 0,
                                y1: 5,
                                x2: 500,
                                y2: 5,
                                lineWidth: 1,
                                lineCap: 'square',
                                alignment: 'justify'
                            }]
                        }
                    ]
                }
            );


            form.subTopics.map(function (subTopic) {

                data.push({
                        stack: [
                            {
                                canvas: [{
                                    type: 'line',
                                    x1: 0,
                                    y1: 5,
                                    x2: 500,
                                    y2: 5,
                                    lineWidth: 1,
                                    lineCap: 'square',
                                    alignment: 'justify'
                                }],
                                text: subTopic.subTopicNumber.concat("\t\t\t", subTopic.subTopicName, "\t\t\t\t\t\t\t\t\t\t", subTopic.subTopicPoints),
                                style: 'subheader',
                                alignment: 'justify'
                            },
                            {
                                canvas: [{
                                    type: 'line',
                                    x1: 0,
                                    y1: 5,
                                    x2: 500,
                                    y2: 5,
                                    lineWidth: 1,
                                    lineCap: 'square',
                                    alignment: 'justify'
                                }]
                            }
                        ]
                    }
                );


                data.push({text: subTopic.subTopicDescription, style: 'description', alignment: 'justify'});
                form.questions.map(function (question) {

                    data.push(
                        {
                            stack: [
                                {
                                    text: question.questionNumber.concat("\t\t", question.questionDescription, "\t\t", question.points, "\n"),
                                    style: 'description'
                                },
                                {
                                    canvas: [{
                                        type: 'rect',
                                        x: 0,
                                        y: 0,
                                        w: 500,
                                        h: 100,
                                        lineWidth: 1,
                                        lineColor: 'black',
                                        alignment: 'justify'
                                    }]
                                }
                            ]
                        }
                    );
                });
            });
        });


        this.docDefinition = {
            footer: function (currentPage, pageCount) {
                return currentPage.toString() + ' of ' + pageCount;
            },
            header: function (currentPage, pageCount, pageSize) {
                return [
                    {
                        canvas: [{
                            type: 'line',
                            x1: 0,
                            y1: 0,
                            x2: 500,
                            y2: 0,
                            lineWidth: 5,
                            lineCap: 'square',
                            alignment: 'justify'
                        }]
                    },
                    {
                        canvas: [{
                            type: 'line',
                            x1: 0,
                            y1: 5,
                            x2: 500,
                            y2: 5,
                            lineWidth: 2,
                            lineCap: 'square',
                            alignment: 'justify'
                        }],
                        text: form.course + " \t" + form.semester + " \t" + form.year + "\nFull Name: " + form.fullName + " \t\t\tMatriculation Number: " + form.matriculationNo + "\t",
                        style: 'normalText'
                    }
                ]
            },
            pageSize: {width: 891, height: 630},
            pageOrientation: 'portrait',

            content: data,

            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: 0
                },
                subheader: {
                    fontSize: 15,
                    bold: true,
                    margin: 0
                },
                normalText: {
                    fontSize: 10,
                    margin: 0,
                    alignment: 'center'
                },
                quote: {
                    italics: true
                },
                small: {
                    fontSize: 8
                },
                description: {
                    fontSize: 10,
                    margin: 0
                }
            }
        };

        console.log("data is:", data)
        this.pdfDocGenerator = pdfMake.createPdf(this.docDefinition);
        this.pdfDocGenerator.getDataUrl((dataUrl) => {
            this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
            this.navCtrl.push(PdfViewerPage, {src: this.pdfUrl});
        });
    }

    changeLanguage(event) {
        this.examService.changeLanguage(event)
    }

    showAlert() {
        const alert = this.alertController.create({
            title: 'Saved!',
            subTitle: 'Your data is saved successfully!',
            buttons: [{
                text: 'OK',
                handler: data => {
                    this.form.reset()
                    this.navCtrl.push(HomePage)
                }
            }]
        });
        alert.present();
    }

    previewImage(event) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();

            reader.onload = (event: any) => {
                this.examSheet = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        let fileList: FileList = event.target.files;
        let file: File = fileList[0];
        console.log(file);
    }


}
