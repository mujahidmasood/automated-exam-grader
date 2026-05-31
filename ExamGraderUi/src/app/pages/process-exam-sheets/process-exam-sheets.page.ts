import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AlertController,
  LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloud, eye, trash } from 'ionicons/icons';
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
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonRadioGroup,
  IonRadio,
} from '@ionic/angular/standalone';
import { AutomatedExamService } from '../../services/automated-exam.service';

@Component({
  selector: 'app-process-exam-sheets',
  templateUrl: 'process-exam-sheets.page.html',
  styleUrls: ['process-exam-sheets.page.scss'],
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
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonRadioGroup,
    IonRadio,
  ],
})
export class ProcessExamSheetsPage {
  processExamForm: FormGroup;
  unProcessedExams: any;

  selectedFiles!: FileList;
  progress: { percentage: number } = { percentage: 0 };
  showFile = false;
  fileUploads: Observable<string[]> | null = null;
  uploadedImage: any;
  language = 'en';

  constructor(
    private formBuilder: FormBuilder,
    private examService: AutomatedExamService,
    private alertController: AlertController,
    private router: Router,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private loadingController: LoadingController
  ) {
    addIcons({ cloud, eye, trash });
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
      language: this.language,
    });
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

  processExamSheets(processDataForm: any) {
    this.examService.saveProcessingData(processDataForm).subscribe(
      (value) => this.presentAlert(value),
      (error1) => console.log(error1)
    );
  }

  async presentAlert(value: any) {
    const alert = await this.alertController.create({
      header: 'Processing Data Saved',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/tabs/grading']);
          },
        },
      ],
    });
    await alert.present();
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  upload(processExamForm: any) {
    this.progress.percentage = 0;
    this.presentLoading();
    this.examService
      .uploadExamSheets(this.selectedFiles, processExamForm)
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(
            (100 * event.loaded) / (event.total || 1)
          );
        } else if (event instanceof HttpResponse) {
          console.log('File is completely uploaded!', event);
        }
      });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Uploading...',
      duration: 5000,
    });
    await loading.present();
    return loading;
  }

  showFiles(enable: boolean, processExamForm: any) {
    this.showFile = enable;
    if (enable) {
      this.fileUploads = this.examService.getFiles(
        processExamForm.inputExamSheetsDirectory
      );
    }
  }

  getUploadedImage(fileName: string, processExamForm: any) {
    const examFolder = processExamForm.inputExamSheetsDirectory;
    this.examService.getImage(examFolder, fileName, '').subscribe(
      (value: any) => {
        const imageUrl = value.imageUrl;
        this.uploadedImage = this.sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/jpg;base64,' + imageUrl
        );
      },
      (error1) => console.log('error ', error1)
    );
  }

  deleteStudentExamSheet(processExamForm: any, fileName: string) {
    this.examService
      .deleteStudentExamSheet(
        processExamForm.inputExamSheetsDirectory,
        fileName
      )
      .subscribe(
        () => this.showFiles(true, processExamForm),
        (error1) => console.log(error1)
      );
  }

  getTranslatedValue(key: string): string {
    let translatedValue = '';
    this.translateService.get(key).subscribe(
      (value) => (translatedValue = value),
      (error) => console.log('could not find translation for', key, error)
    );
    return translatedValue;
  }

  changeLanguage(event: any) {
    this.examService.changeLanguage(event.detail.value);
  }
}
