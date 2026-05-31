import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { AutomatedExamService } from '../../services/automated-exam.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: 'pdf-viewer.page.html',
  styleUrls: ['pdf-viewer.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
  ],
})
export class PdfViewerPage {
  data: any;

  constructor(
    private examService: AutomatedExamService,
    private location: Location
  ) {}

  ionViewWillEnter() {
    this.data = this.examService.getNavData('pdfSrc');
  }

  closePdfViewer() {
    this.location.back();
  }
}
