import {Component} from '@angular/core';
import {AutomatedExamService} from "../../providers/service";
import {TranslateService} from "@ngx-translate/core";
import {AlertController, NavController, NavParams} from "ionic-angular";
import 'rxjs/add/operator/map';
import * as XLSX from 'xlsx';
import {FormBuilder, FormGroup} from "@angular/forms";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {DomSanitizer} from "@angular/platform-browser";
import {PdfViewerPage} from "../pdfViewer/pdf_viewer";
import {HomePage} from "../home/home";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'page-grading-details',
    templateUrl: 'grading-details.html'
})

export class GradingDetailsPage {

    language: string;

    gradedExam: any;
    form: FormGroup;
    croppedImage;
    pdfUrl: any;
    pdfDocGenerator: any = null;


    studentGradeDetails = [];
    pointDetails = [];


    detailsShown = false;
    studentGradeDetailsHeader = {
        columns: {
            matriculationNumber: {
                title: 'Matriculation Number',
                editable: true
            },
            passed: {
                title: 'Passed',
                editable: true,
            },
            grade: {
                title: 'Grade',
                editable: true,
            }
        },
        actions: {
            delete: true,
            custom: [
                {
                    name: 'showDetails',
                    title: `Show Details`,
                    filter: false,
                    type: 'html',
                    position: 'right'
                },
                {
                    name: 'imageScan',
                    title: `Download Exam Sheet`,
                    filter: false,
                    type: 'html',
                    position: 'right'
                },

            ],


        },
        attr: {
            class: 'table table-bordered'
        },
    };
    pointDetailsHeader = {
        columns: {
            questionNumber: {
                title: 'Question Number',
                editable: true
            },
            possibleAnswers: {
                title: 'Correct Answer',
                editable: true
            },
            answerGivenByStudent: {
                title: 'Student Answer',
                editable: true
            },
            achievablePoints: {
                title: 'Achievable Points',
                editable: true
            },
            achievedPoints: {
                title: 'Achieved Points',
                editable: true
            }
        },
        actions: {
            add: true,
            delete: true,
            edit: true,
            custom: [
                {
                    name: 'hideDetails',
                    title: `Hide Details`,
                    filter: false,
                    type: 'html',
                    position: 'right'
                },
                {
                    name: 'imageScan',
                    title: `View Scanned`,
                    filter: false,
                    type: 'html',
                    position: 'left'
                }
            ]
        },
        attr: {
            class: 'table table-bordered'
        },

    };

    constructor(
        private _FB: FormBuilder,
        private examService: AutomatedExamService,
        private translateService: TranslateService,
        private navCtrl: NavController,
        private navParams: NavParams,
        private sanitizer: DomSanitizer,
        private alertController: AlertController) {

        this.examService.changeLanguage('en');
        this.language = this.examService.getCurrentLang();

        this.form = this._FB.group({
            language: this.language,
        });

    }

    helpMenu() {
    }

    ngOnInit(): void {
        if (this.navParams.get('gradedExam')) {
            let gradedExam = this.navParams.get('gradedExam');
            this.studentGradeDetails = gradedExam.studentGradeDetails;
            this.pointDetails = gradedExam.studentGradeDetails.pointDetails;
            this.gradedExam = gradedExam;

        }

    }

    gradeDetailsCustomAction(value) {

        if (value.action == 'imageScan') {
            console.log("value = ", value);
            console.log("value data ", value.data);
            let examFolder = value.data.examFolder;
            let fileName = value.data.matriculationNumber + ".pdf";
            console.log("fileName , examFolder ", fileName, examFolder);
            let response = this.examService.getScannedExamSheet(examFolder, fileName);


            let pdfData
            response.subscribe(
                (value) => {
                    //this.pdfDocGenerator = pdfMake.createPdf(value);
                    //this.pdfDocGenerator.getDataUrl((dataUrl) => {
                     //   console.log("value response = ",dataUrl);
                        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value);
                        this.navCtrl.push(PdfViewerPage, {src: this.pdfUrl});
                   // });

                },
                error1 => {
                    console.log("error ", error1)
                },
            )

        } else if (value.action == 'showDetails') {
            this.pointDetails = value.data.pointDetails;
            this.detailsShown = true;
        }

    }

    pointDetailsCustomAction(value) {
        if (value.action == "hideDetails") {
            this.detailsShown = false;
        } else if (value.action == "imageScan") {
            let examFolder = value.data.examFolder;
            let fileName = value.data.questionImageName;
            let answerCoordinates = value.data.answerCoordinates;
            let response = this.examService.getImage(examFolder, fileName, answerCoordinates);
            response.subscribe(
                (value: any) => {
                    if (value != null) {
                        let imageUrl = value.imageUrl
                        this.croppedImage = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageUrl);
                    }
                },
                error1 => {
                    console.log("error ", error1)
                }
            )
        }

    }

    deleteGrades(event) {
        event.confirm.resolve(event.newData)
        console.log("calling new function", event)
    }

    updateGrades() {
        console.log("gradedExam", this.gradedExam);

        let response = this.examService.updateGrades(this.gradedExam);
        response.subscribe(
            value => {
                console.log("upgradeExam() return value ", value)
                this.showAlert();
            },
            error1 => console.log("upgradeExam() failed ", error1)
        )
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

    exportExcel() {
        let gradeDetails: any = {};

        let course;
        const workBook = XLSX.utils.book_new();
        let worksheet;

        let matriculationId;
        let passed;
        let totalPoints = 0;

        for (let studentGradeDetailIndex in this.studentGradeDetails) {
            let studentGradeDetail = this.studentGradeDetails[studentGradeDetailIndex];
            course = studentGradeDetail.course;

            matriculationId = studentGradeDetail.matriculationNumber;
            passed = studentGradeDetail.passed;

            for (let pointDetailIndex in studentGradeDetail.pointDetails) {

                let pointDetail = studentGradeDetail.pointDetails[pointDetailIndex];
                totalPoints += Number(pointDetail.achievedPoints);

                gradeDetails = {
                    "Matriculation Number": matriculationId,
                    "Passed": passed,
                    "Total Points": totalPoints,
                    ["Question Number"]: studentGradeDetail.pointDetails[pointDetailIndex].questionNumber,
                    ["AchievablePoints"]: studentGradeDetail.pointDetails[pointDetailIndex].achievablePoints,
                    ["Possible Answers"]: studentGradeDetail.pointDetails[pointDetailIndex].possibleAnswers,
                    ["Achievable Points"]: studentGradeDetail.pointDetails[pointDetailIndex].achievablePoints,
                    ["Student Answer"]: studentGradeDetail.pointDetails[pointDetailIndex].answerGivenByStudent,
                    ["Achieved Points"]: studentGradeDetail.pointDetails[pointDetailIndex].achievedPoints,
                };

            }
        }

        worksheet = XLSX.utils.json_to_sheet([gradeDetails]);
        XLSX.utils.book_append_sheet(workBook, worksheet, course + " Grades");
        XLSX.writeFile(workBook, course + '.xlsx');
    }

    changeLanguage(event) {
        this.examService.changeLanguage(event)
    }


}
