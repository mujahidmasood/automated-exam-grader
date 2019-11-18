import {Component, ViewChild} from '@angular/core';
import {AutomatedExamService} from "../../providers/service";
import {AngularCropperjsComponent} from 'angular-cropperjs';
import {AlertController} from "ionic-angular";

@Component({
    selector: 'page-crop-exam',
    templateUrl: 'crop-exam.html'
})
export class CropExamPage {

    @ViewChild('angularCropper')
    public angularCropper: AngularCropperjsComponent;

    language: string;
    examSheet: any;
    cropperOptions: any;
    croppedImage = null;

    scaleValX = 1;
    scaleValY = 1;

    cropBoxData

    constructor(private examService: AutomatedExamService,
                private alertCtrl: AlertController) {

        this.cropperOptions = {
            dragMode: 'crop',
            aspectRatio: 0,
            autoCrop: true,
            movable: true,
            zoomable: false,
            scalable: true,
            autoCropArea: 0.1
        };

        this.language = this.examService.getCurrentLang();
        this.examService.changeLanguage('en');
        this.language = this.examService.getCurrentLang();

    }

    changeLanguage(event) {
        this.examService.changeLanguage(event)
    }

    helpMenu() {
    }

    previewImage(event) {
        if (event.target.files && event.target.files[0]) {
            this.examSheet = event.target.result;
            let reader = new FileReader();

            reader.onloadend = (event: any) => {
                this.examSheet = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    reset() {
        this.angularCropper.cropper.reset();
    }

    clear() {
        this.angularCropper.cropper.clear();
    }

    rotate() {
        this.angularCropper.cropper.rotate(90);
    }

    zoom(zoomIn: boolean) {
        let factor = zoomIn ? 0.1 : -0.1;
        this.angularCropper.cropper.zoom(factor);
    }

    scaleX() {
        this.scaleValX = this.scaleValX * -1;
        this.angularCropper.cropper.scaleX(this.scaleValX);
    }

    scaleY() {
        this.scaleValY = this.scaleValY * -1;
        this.angularCropper.cropper.scaleY(this.scaleValY);
    }

    move(x, y) {
        this.angularCropper.cropper.move(x, y);
    }

    getBase64Image() {
        let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
        this.croppedImage = croppedImgB64String;
    }

    save() {

        this.cropBoxData = this.angularCropper.cropper.cropBoxData;
        console.log("this cropBox Data ", this.cropBoxData);
        let left = this.cropBoxData.left;
        let height = this.cropBoxData.height;
        let minTop = this.cropBoxData.minTop;
        let maxWidth = this.cropBoxData.maxWidth;
        let maxLeft = this.cropBoxData.maxLeft;
        let top = this.cropBoxData.top;


        console.log("maxWidth = " + maxWidth)
        let x = maxWidth - left;
        let y = top;
        let w = maxLeft;
        let h = Math.round((top + height) * (minTop));

        let alert = this.alertCtrl.create({
            title: 'Cropped Coordinates',
            subTitle: x + ',' + y + ',' + w + ',' + h,
            buttons: ['OK']
        });
        alert.present();


        let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
        this.croppedImage = croppedImgB64String;
    }


}
