import {Component} from '@angular/core';

import { NavParams, ViewController} from "ionic-angular";


@Component({
    selector: 'page-pdf-viewer',
    templateUrl: 'pdf_viewer.html'
})
export class PdfViewerPage {

    data : any;

    constructor(private navParams: NavParams, private view: ViewController) {
    }

    closePdfViewer() {
        const data = {
            src: null
        };
        this.view.dismiss(data);
    }

    ionViewWillLoad() {
        this.data = this.navParams.get('src');
        console.log("src = ", this.data);
    }
}
