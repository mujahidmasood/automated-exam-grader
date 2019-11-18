import {Component} from '@angular/core';
import {AutomatedExamService} from "../../providers/service";
import {NavController} from "ionic-angular";
import {AddExamPage} from "../add_exam/add-exam";
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    unProcessedExams = [];
    language = 'en';
    searchDivHidden = true;

    descending: boolean = false;
    order: number;
    column: string = 'course';

    constructor(
        private examService: AutomatedExamService,
        private navCtrl: NavController,
        private translateService: TranslateService) {


        this.examService.changeLanguage('en');
        this.language = this.examService.getCurrentLang();
    }

    searchUnprocessedExams() {
        this.searchDivHidden = false;
    }

    addNewExam() {
        this.navCtrl.push(AddExamPage)
    }

    ionViewDidLoad() {
        this.getUnProcessedSheets()
    }

    getUnProcessedSheets() {
        let response = this.examService.getUnProcessedSheets();
        response.subscribe(
            value => {
                this.unProcessedExams = value;
                console.log("this.unProcessedExams ", this.unProcessedExams)
            },
            error1 => console.log(error1)
        )
    }

    editDetails(index) {
        if (index > -1) {
            let unProcessedExam = this.unProcessedExams[index];
            this.navCtrl.push(AddExamPage, {exam: unProcessedExam})
        }
    }

    deleteExam(index) {
        let unProcessedExam = this.unProcessedExams[index];
        if (index > -1) {
            this.unProcessedExams.splice(index, 1);
            let response = this.examService.deleteExam(unProcessedExam);
            response.subscribe(
                value => console.log("value = ", value),
                error1 => console.log(error1)
            )
        }
    }

    helpMenu() {

    }

    hideSearchDiv() {
        this.searchDivHidden = true;
    }

    sort() {
        this.descending = !this.descending;
        this.order = this.descending ? 1 : -1;
    }

    getTranslatedValue(key) {
        let translatedValue = '';
        if(key) {
            this.translateService.get(key).subscribe(
                value => {
                    translatedValue = value
                },
                error => {
                    console.log('could not find translation for', translatedValue, error)
                }
            )
        }

        return translatedValue;
    }
}
