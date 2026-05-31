import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, cloud, help, add, settings, trash } from 'ionicons/icons';
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
  IonFab,
  IonFabButton,
  IonFabList,
  IonChip,
  IonList,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonRadioGroup,
  IonRadio,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AutomatedExamService } from '../../services/automated-exam.service';
import { AutoresizeDirective } from '../../directives/autoresize.directive';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs ?? (pdfFonts as any).pdfMake?.vfs;

@Component({
  selector: 'app-add-exam',
  templateUrl: 'add-exam.page.html',
  styleUrls: ['add-exam.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    AutoresizeDirective,
    IonHeader,
    IonToolbar,
    IonContent,
    IonRow,
    IonCol,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonFabList,
    IonChip,
    IonList,
    IonItem,
    IonItemDivider,
    IonItemGroup,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonRadioGroup,
    IonRadio,
  ],
})
export class AddExamPage {
  form: FormGroup;
  language: string;
  examSheet: any;
  pdfUrl: any;
  pdfDocGenerator: any = null;
  docDefinition: any = null;
  private editingExam: any = null;

  constructor(
    private _FB: FormBuilder,
    private examService: AutomatedExamService,
    private alertController: AlertController,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    addIcons({ eye, cloud, help, add, settings, trash });
    this.examService.changeLanguage('en');
    this.language = this.examService.getCurrentLang();

    const exam = this.examService.getNavData('exam');
    if (exam) {
      this.editingExam = exam;
      const newTopics = (exam.topics || []).map((topic: any) =>
        this._FB.group({
          topicName: topic.topicName,
          topicNumber: topic.topicNumber,
          topicPoints: topic.topicPoints,
          topicDescription: topic.topicDescription,
        })
      );

      const newSubTopics = (exam.subTopics || []).map((subTopic: any) =>
        this._FB.group({
          subTopicName: subTopic.subTopicName,
          subTopicNumber: subTopic.subTopicNumber,
          subTopicPoints: subTopic.subTopicPoints,
          subTopicDescription: subTopic.subTopicDescription,
        })
      );

      const newQuestions = (exam.questions || []).map((question: any) =>
        this._FB.group({
          questionNumber: question.questionNumber,
          possibleAnswers: question.possibleAnswers,
          points: question.points,
          answerCoordinates: question.answerCoordinates,
          questionDescription: question.questionDescription,
          questionType: question.questionType,
          isMandatory: question.isMandatory,
        })
      );

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
        questions: this._FB.array(newQuestions),
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
        topics: this._FB.array([this.initTopics()]),
        subTopics: this._FB.array([this.initSubTopics()]),
        questions: this._FB.array([this.initQuestionFields()]),
      });
    }
  }

  get topicsControls() {
    return (this.form.get('topics') as FormArray).controls;
  }
  get subTopicsControls() {
    return (this.form.get('subTopics') as FormArray).controls;
  }
  get questionsControls() {
    return (this.form.get('questions') as FormArray).controls;
  }

  initTopics(): FormGroup {
    return this._FB.group({
      topicName: '',
      topicNumber: '',
      topicPoints: '',
      topicDescription: '',
    });
  }

  initSubTopics(): FormGroup {
    return this._FB.group({
      subTopicName: '',
      subTopicNumber: '',
      subTopicPoints: '',
      subTopicDescription: '',
    });
  }

  initQuestionFields(): FormGroup {
    return this._FB.group({
      questionNumber: ['', Validators.required],
      possibleAnswers: ['', Validators.required],
      points: ['', Validators.required],
      answerCoordinates: [''],
      questionDescription: ['', Validators.required],
      questionType: [''],
      isMandatory: [''],
    });
  }

  addQuestionsSection(): void {
    (this.form.controls['questions'] as FormArray).push(
      this.initQuestionFields()
    );
  }

  addTopicsSection(): void {
    (this.form.controls['topics'] as FormArray).push(this.initTopics());
  }

  addSubTopicsSection(): void {
    (this.form.controls['subTopics'] as FormArray).push(this.initSubTopics());
  }

  removeTopicsSection(i: number): void {
    (this.form.controls['topics'] as FormArray).removeAt(i);
  }

  removeQuestionsSection(i: number): void {
    (this.form.controls['questions'] as FormArray).removeAt(i);
  }

  removeSubTopicsSection(i: number): void {
    (this.form.controls['subTopics'] as FormArray).removeAt(i);
  }

  saveExamData(examData: any): void {
    if (this.editingExam) {
      examData.id = this.editingExam.id;
    }
    this.examService.addExam(examData).subscribe(
      (value) => {
        if (value) {
          this.showAlert();
        }
      },
      (error1) => console.log(error1)
    );
  }

  viewExamPdf(form: any) {
    const data: any[] = [];

    (form.topics || []).forEach((topic: any) => {
      data.push({
        stack: [
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 5,
                x2: 500,
                y2: 5,
                lineWidth: 1,
                lineCap: 'square',
              },
            ],
            text: `${topic.topicNumber}\t\t\t${topic.topicName}\t\t\t\t\t\t\t\t\t\t${topic.topicPoints}`,
            style: 'header',
          },
        ],
      });

      (form.subTopics || []).forEach((subTopic: any) => {
        data.push({
          stack: [
            {
              text: `${subTopic.subTopicNumber}\t\t\t${subTopic.subTopicName}\t\t\t\t\t\t\t\t\t\t${subTopic.subTopicPoints}`,
              style: 'subheader',
            },
          ],
        });
        data.push({
          text: subTopic.subTopicDescription,
          style: 'description',
        });

        (form.questions || []).forEach((question: any) => {
          data.push({
            stack: [
              {
                text: `${question.questionNumber}\t\t${question.questionDescription}\t\t${question.points}\n`,
                style: 'description',
              },
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 500,
                    h: 100,
                    lineWidth: 1,
                    lineColor: 'black',
                  },
                ],
              },
            ],
          });
        });
      });
    });

    this.docDefinition = {
      footer: (currentPage: number, pageCount: number) =>
        currentPage.toString() + ' of ' + pageCount,
      header: () => [
        {
          text: `${form.course} \t${form.semester} \t${form.year}\nFull Name: ${form.fullName} \t\t\tMatriculation Number: ${form.matriculationNo}\t`,
          style: 'normalText',
        },
      ],
      pageSize: { width: 891, height: 630 },
      pageOrientation: 'portrait',
      content: data,
      styles: {
        header: { fontSize: 18, bold: true, margin: 0 },
        subheader: { fontSize: 15, bold: true, margin: 0 },
        normalText: { fontSize: 10, margin: 0, alignment: 'center' },
        quote: { italics: true },
        small: { fontSize: 8 },
        description: { fontSize: 10, margin: 0 },
      },
    };

    this.pdfDocGenerator = pdfMake.createPdf(this.docDefinition);
    this.pdfDocGenerator.getDataUrl((dataUrl: string) => {
      this.examService.setNavData(
        'pdfSrc',
        this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl)
      );
      this.router.navigate(['/pdf-viewer']);
    });
  }

  changeLanguage(event: any) {
    this.examService.changeLanguage(event.detail.value);
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

  previewImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.examSheet = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
