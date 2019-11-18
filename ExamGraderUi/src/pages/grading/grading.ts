import {Component} from '@angular/core';
import {AutomatedExamService} from "../../providers/service";
import {TranslateService} from "@ngx-translate/core";
import {NavController} from "ionic-angular";
import {GradingDetailsPage} from "../grading-details/grading-details";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
    selector: 'page-grading',
    templateUrl: 'grading.html'
})
export class GradingPage {

    language: string;
    searchDivHidden: boolean = true;

    descending: boolean = false;
    order: number;
    column: string = 'course';
    form: FormGroup;

    gradedExams = [];

    constructor(
        private _FB: FormBuilder,
        private examService: AutomatedExamService,
        private translateService: TranslateService,
        private navCtrl: NavController) {

        this.examService.changeLanguage('en');
        this.language = this.examService.getCurrentLang();

        this.form = this._FB.group({
            language: this.language,
        });
    }

    ionViewDidLoad() {
        let response = this.examService.getGradedExams();
        response.subscribe(
            value => {
                this.gradedExams = value;
                console.log("this.gradedExams ", this.gradedExams)
            },
            error1 => console.log(error1)
        )
    }


    showSearchDiv() {
        this.searchDivHidden = false;
    }

    hideSearchDiv() {
        this.searchDivHidden = true;
    }

    helpMenu() {
    }

    sort() {
        this.descending = !this.descending;
        this.order = this.descending ? 1 : -1;
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

    deleteGrading(index) {
        let unProcessedExam = this.gradedExams[index];
        if (index > -1) {
            this.gradedExams.splice(index, 1);
            let response = this.examService.deleteGrading(unProcessedExam);
            response.subscribe(
                value => console.log("value = ", value),
                error1 => console.log(error1)
            )
        }
    }

    viewGrading(index) {
        if (index > -1) {
            let gradedExam = this.gradedExams[index];
            this.navCtrl.push(GradingDetailsPage, {gradedExam: gradedExam});
        }
    }

    changeLanguage(event) {
        this.examService.changeLanguage(event)
    }
}
