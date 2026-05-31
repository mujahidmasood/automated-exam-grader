import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { help, close, checkmark } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import Cropper from 'cropperjs';
import { AutomatedExamService } from '../../services/automated-exam.service';

@Component({
  selector: 'app-crop-exam',
  templateUrl: 'crop-exam.page.html',
  styleUrls: ['crop-exam.page.scss'],
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
    IonIcon,
  ],
})
export class CropExamPage {
  @ViewChild('cropperImage') cropperImage!: ElementRef<HTMLImageElement>;

  language!: string;
  examSheet: any;
  croppedImage: any = null;
  scaleValX = 1;
  scaleValY = 1;
  cropBoxData: any;

  private cropper?: Cropper;

  constructor(
    private examService: AutomatedExamService,
    private alertCtrl: AlertController
  ) {
    addIcons({ help, close, checkmark });
    this.examService.changeLanguage('en');
    this.language = this.examService.getCurrentLang();
  }

  helpMenu() {}

  previewImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = (e: any) => {
        this.examSheet = e.target.result;
        setTimeout(() => this.initCropper(), 0);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private initCropper() {
    if (this.cropper) {
      this.cropper.destroy();
    }
    if (this.cropperImage) {
      this.cropper = new Cropper(this.cropperImage.nativeElement, {
        dragMode: 'crop',
        aspectRatio: NaN,
        autoCrop: true,
        movable: true,
        zoomable: false,
        scalable: true,
        autoCropArea: 0.1,
      });
    }
  }

  reset() {
    this.cropper?.reset();
  }

  clear() {
    this.cropper?.clear();
  }

  rotate() {
    this.cropper?.rotate(90);
  }

  zoom(zoomIn: boolean) {
    this.cropper?.zoom(zoomIn ? 0.1 : -0.1);
  }

  scaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.cropper?.scaleX(this.scaleValX);
  }

  scaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.cropper?.scaleY(this.scaleValY);
  }

  move(x: number, y: number) {
    this.cropper?.move(x, y);
  }

  getBase64Image() {
    const canvas = this.cropper?.getCroppedCanvas();
    if (canvas) {
      this.croppedImage = canvas.toDataURL('image/jpeg', 1);
    }
  }

  async save() {
    if (!this.cropper) return;
    this.cropBoxData = this.cropper.getCropBoxData();
    const canvasData = this.cropper.getCanvasData();

    const left = this.cropBoxData.left;
    const height = this.cropBoxData.height;
    const top = this.cropBoxData.top;
    const maxWidth = canvasData.width;
    const maxLeft = canvasData.left;

    const x = maxWidth - left;
    const y = top;
    const w = maxLeft;
    const h = Math.round(top + height);

    const alert = await this.alertCtrl.create({
      header: 'Cropped Coordinates',
      subHeader: x + ',' + y + ',' + w + ',' + h,
      buttons: ['OK'],
    });
    await alert.present();

    const canvas = this.cropper.getCroppedCanvas();
    if (canvas) {
      this.croppedImage = canvas.toDataURL('image/jpeg', 1);
    }
  }
}
