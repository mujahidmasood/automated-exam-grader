import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular/standalone';
import * as XLSX from 'xlsx';
import { addIcons } from 'ionicons';
import { document, cloud, help, eye, trash } from 'ionicons/icons';
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
  IonGrid,
  IonRadioGroup,
  IonRadio,
} from '@ionic/angular/standalone';
import { AutomatedExamService } from '../../services/automated-exam.service';

@Component({
  selector: 'app-grading-details',
  templateUrl: 'grading-details.page.html',
  styleUrls: ['grading-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonRow,
    IonCol,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonGrid,
    IonRadioGroup,
    IonRadio,
  ],
})
export class GradingDetailsPage {
  language!: string;
  gradedExam: any;
  form: FormGroup;
  croppedImage: any;

  studentGradeDetails: any[] = [];
  pointDetails: any[] = [];
  detailsShown = false;

  constructor(
    private _FB: FormBuilder,
    private examService: AutomatedExamService,
    private translateService: TranslateService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private alertController: AlertController
  ) {
    addIcons({ document, cloud, help, eye, trash });
    this.examService.changeLanguage('en');
    this.language = this.examService.getCurrentLang();
    this.form = this._FB.group({ language: this.language });
  }

  helpMenu() {}

  ngOnInit(): void {
    const gradedExam = this.examService.getNavData('gradedExam');
    if (gradedExam) {
      this.studentGradeDetails = gradedExam.studentGradeDetails || [];
      this.gradedExam = gradedExam;
    }
  }

  showDetails(detail: any) {
    this.pointDetails = detail.pointDetails || [];
    this.detailsShown = true;
  }

  hideDetails() {
    this.detailsShown = false;
  }

  downloadExamSheet(detail: any) {
    const examFolder = detail.examFolder;
    const fileName = detail.matriculationNumber + '.pdf';
    this.examService.getScannedExamSheet(examFolder, fileName).subscribe(
      (value: any) => {
        const url = URL.createObjectURL(value);
        this.examService.setNavData(
          'pdfSrc',
          this.sanitizer.bypassSecurityTrustResourceUrl(url)
        );
        this.router.navigate(['/pdf-viewer']);
      },
      (error1) => console.log('error ', error1)
    );
  }

  viewScannedQuestion(point: any) {
    const examFolder = point.examFolder;
    const fileName = point.questionImageName;
    const answerCoordinates = point.answerCoordinates;
    this.examService.getImage(examFolder, fileName, answerCoordinates).subscribe(
      (value: any) => {
        if (value != null) {
          this.croppedImage = this.sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/jpg;base64,' + value.imageUrl
          );
        }
      },
      (error1) => console.log('error ', error1)
    );
  }

  deleteGradeRow(index: number) {
    this.studentGradeDetails.splice(index, 1);
  }

  deletePointRow(index: number) {
    this.pointDetails.splice(index, 1);
  }

  updateGrades() {
    this.examService.updateGrades(this.gradedExam).subscribe(
      () => this.showAlert(),
      (error1) => console.log('updateGrades() failed ', error1)
    );
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Saved!',
      subHeader: 'Your data is saved successfully!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.form.reset();
            this.router.navigate(['/tabs/home']);
          },
        },
      ],
    });
    await alert.present();
  }

  exportExcel() {
    let gradeDetails: any = {};
    let course;
    const workBook = XLSX.utils.book_new();
    let matriculationId;
    let passed;
    let totalPoints = 0;

    for (const studentGradeDetail of this.studentGradeDetails) {
      course = studentGradeDetail.course;
      matriculationId = studentGradeDetail.matriculationNumber;
      passed = studentGradeDetail.passed;

      for (const pointDetail of studentGradeDetail.pointDetails || []) {
        totalPoints += Number(pointDetail.achievedPoints);
        gradeDetails = {
          'Matriculation Number': matriculationId,
          Passed: passed,
          'Total Points': totalPoints,
          'Question Number': pointDetail.questionNumber,
          'Possible Answers': pointDetail.possibleAnswers,
          'Achievable Points': pointDetail.achievablePoints,
          'Student Answer': pointDetail.answerGivenByStudent,
          'Achieved Points': pointDetail.achievedPoints,
        };
      }
    }

    const worksheet = XLSX.utils.json_to_sheet([gradeDetails]);
    XLSX.utils.book_append_sheet(workBook, worksheet, (course || 'Exam') + ' Grades');
    XLSX.writeFile(workBook, (course || 'exam') + '.xlsx');
  }

  changeLanguage(event: any) {
    this.examService.changeLanguage(event.detail.value);
  }
}
