import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  search,
  add,
  help,
  reorderFour,
  close,
  create,
  trash,
} from 'ionicons/icons';
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
} from '@ionic/angular/standalone';
import { AutomatedExamService } from '../../services/automated-exam.service';
import { SearchPipe } from '../../pipes/search.pipe';
import { SortPipe } from '../../pipes/sort.pipe';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  ],
})
export class HomePage {
  unProcessedExams: any[] = [];
  language = 'en';
  searchDivHidden = true;
  terms = '';

  descending = false;
  order!: number;
  column = 'course';

  constructor(
    private examService: AutomatedExamService,
    private router: Router,
    private translateService: TranslateService
  ) {
    addIcons({ search, add, help, reorderFour, close, create, trash });
    this.examService.changeLanguage('en');
    this.language = this.examService.getCurrentLang();
  }

  searchUnprocessedExams() {
    this.searchDivHidden = false;
  }

  addNewExam() {
    this.examService.setNavData('exam', null);
    this.router.navigate(['/add-exam']);
  }

  ionViewWillEnter() {
    this.getUnProcessedSheets();
  }

  getUnProcessedSheets() {
    this.examService.getUnProcessedSheets().subscribe(
      (value) => (this.unProcessedExams = value),
      (error1) => console.log(error1)
    );
  }

  editDetails(index: number) {
    if (index > -1) {
      const unProcessedExam = this.unProcessedExams[index];
      this.examService.setNavData('exam', unProcessedExam);
      this.router.navigate(['/add-exam']);
    }
  }

  deleteExam(index: number) {
    const unProcessedExam = this.unProcessedExams[index];
    if (index > -1) {
      this.unProcessedExams.splice(index, 1);
      this.examService.deleteExam(unProcessedExam).subscribe(
        (value) => console.log('value = ', value),
        (error1) => console.log(error1)
      );
    }
  }

  helpMenu() {}

  hideSearchDiv() {
    this.searchDivHidden = true;
  }

  sort() {
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }

  getTranslatedValue(key: string): string {
    let translatedValue = '';
    if (key) {
      this.translateService.get(key).subscribe(
        (value) => (translatedValue = value),
        (error) => console.log('could not find translation for', key, error)
      );
    }
    return translatedValue;
  }
}
