import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { search, help, reorderFour, close, eye, trash } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonRow,
  IonCol,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonList,
  IonItem,
  IonItemSliding,
  IonRadioGroup,
  IonRadio,
} from '@ionic/angular/standalone';
import { AutomatedExamService } from '../../services/automated-exam.service';
import { SearchPipe } from '../../pipes/search.pipe';
import { SortPipe } from '../../pipes/sort.pipe';

@Component({
  selector: 'app-grading',
  templateUrl: 'grading.page.html',
  styleUrls: ['grading.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SearchPipe,
    SortPipe,
    IonHeader,
    IonToolbar,
    IonContent,
    IonRow,
    IonCol,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonList,
    IonItem,
    IonItemSliding,
    IonRadioGroup,
    IonRadio,
  ],
})
export class GradingPage {
  language!: string;
  searchDivHidden = true;
  terms = '';

  descending = false;
  order!: number;
  column = 'course';
  form: FormGroup;

  gradedExams: any[] = [];

  constructor(
    private _FB: FormBuilder,
    private examService: AutomatedExamService,
    private translateService: TranslateService,
    private router: Router
  ) {
    addIcons({ search, help, reorderFour, close, eye, trash });
    this.examService.changeLanguage('en');
    this.language = this.examService.getCurrentLang();
    this.form = this._FB.group({ language: this.language });
  }

  ionViewWillEnter() {
    this.examService.getGradedExams().subscribe(
      (value) => (this.gradedExams = value),
      (error1) => console.log(error1)
    );
  }

  showSearchDiv() {
    this.searchDivHidden = false;
  }

  hideSearchDiv() {
    this.searchDivHidden = true;
  }

  helpMenu() {}

  sort() {
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }

  getTranslatedValue(key: string): string {
    let translatedValue = '';
    this.translateService.get(key).subscribe(
      (value) => (translatedValue = value),
      (error) => console.log('could not find translation for', key, error)
    );
    return translatedValue;
  }

  deleteGrading(index: number) {
    const gradedExam = this.gradedExams[index];
    if (index > -1) {
      this.gradedExams.splice(index, 1);
      this.examService.deleteGrading(gradedExam).subscribe(
        (value) => console.log('value = ', value),
        (error1) => console.log(error1)
      );
    }
  }

  viewGrading(index: number) {
    if (index > -1) {
      const gradedExam = this.gradedExams[index];
      this.examService.setNavData('gradedExam', gradedExam);
      this.router.navigate(['/grading-details']);
    }
  }

  changeLanguage(event: any) {
    this.examService.changeLanguage(event.detail.value);
  }
}
