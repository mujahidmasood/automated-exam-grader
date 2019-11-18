import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AutomatedExamService} from "../../providers/service";
import {Observable} from "rxjs";
import {AlertController, LoadingController, NavController} from 'ionic-angular';
import {HttpEventType, HttpResponse} from "../../../node_modules/@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {GradingPage} from "../grading/grading";

@Component({
    selector: 'page-process',
    templateUrl: 'process_exam_sheets.html'
})
export class ProcessExamSheets {

    processExamForm: FormGroup;
    public unProcessedExams;

    selectedFiles: FileList;
    progress: { percentage: number } = {percentage: 0};
    showFile = false;
    fileUploads: Observable<string[]> = null;
    uploadedImage: any;
    language = 'en';

    constructor(private formBuilder: FormBuilder,
                private examService: AutomatedExamService,
                private alertController: AlertController,
                private navCtrl: NavController,
                private sanitizer: DomSanitizer,
                private translateService: TranslateService,
                private loadingController: LoadingController) {

        this.language = this.examService.getCurrentLang();
        this.examService.changeLanguage('en');
        this.language = this.examService.getCurrentLang();

        this.processExamForm = this.formBuilder.group({
            id: '',
            processingDate: '',
            processingTime: '',
            processingMode: '',
            inputExamSheetsDirectory: '',
            reorderExams: true,
            gradingMode: 'full',
            language: this.language

        })
    }

    ionViewDidLoad() {
        this.getUnProcessedSheets()
    }

    getUnProcessedSheets() {
        let response = this.examService.getUnProcessedSheets()
        response.subscribe(
            value => this.unProcessedExams = value,
            error1 => console.log(error1)
        )
    }

    processExamSheets(processDataForm) {
        let response = this.examService.saveProcessingData(processDataForm)
        response.subscribe(
            value => {
                this.presentAlert(value)
            },
            error1 => console.log(error1)
        )
    }

    presentAlert(value) {
        let alert = this.alertController.create({
            title: 'Processing Data Saved',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.navCtrl.push(GradingPage)
                    }
                }
            ]
        });
        alert.present();
    }

    selectFile(event) {
        this.selectedFiles = event.target.files;
    }

    upload(processExamForm) {

        this.progress.percentage = 0;

        let response = this.examService.uploadExamSheets(this.selectedFiles, processExamForm);
        let loader = this.presentLoading()
        response.subscribe(event => {

            if (event.type === HttpEventType.UploadProgress) {
                this.progress.percentage = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
                console.log('File is completely uploaded!', event);
            }

        });

    }

    presentLoading() {
        let loading = this.loadingController.create({
            spinner: 'hide',
            content: `<img src="assets/imgs/gif.gif" />`,
            duration: 5000
        });

        loading.onDidDismiss(() => {
            console.log('Dismissed loading');
        });

        loading.present();
        return loading;
    }

    showFiles(enable: boolean, processExamForm) {
        this.showFile = enable;

        if (enable) {
            this.fileUploads = this.examService.getFiles(processExamForm.inputExamSheetsDirectory);
        }
    }

    getUploadedImage(fileName, processExamForm) {
        console.log("processExamForm", processExamForm)
        let examFolder = processExamForm.inputExamSheetsDirectory;
        console.log("examFolder", examFolder);
        console.log("fileName", fileName)

        let response = this.examService.getImage(examFolder, fileName, '');
        response.subscribe(
            (value: any) => {
                console.log("value ", value);
                let imageUrl = value.imageUrl;
                this.uploadedImage = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageUrl);

            },

            error1 => {
                console.log("error ", error1)
            }
        )
    }

    deleteStudentExamSheet(processExamForm, fileName) {

        let response = this.examService.deleteStudentExamSheet(processExamForm.inputExamSheetsDirectory, fileName);
        response.subscribe(
            value => {
                console.log("value = ", value)
                this.showFiles(true, processExamForm)
            }
            ,
            error1 => console.log(error1)
        )
    }

    getTranslatedValue(key) {
        let translatedValue = '';
        this.translateService.get(key).subscribe(
            value => {
                translatedValue = value
            },
            error => {
                console.log('could not find translation for', translatedValue, error)
            }
        )
        return translatedValue;
    }

    changeLanguage(event) {
        this.examService.changeLanguage(event)
    }

}
