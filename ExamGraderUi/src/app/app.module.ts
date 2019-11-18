import {MyApp} from './app.component';
import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {AutomatedExamService} from "../providers/service";
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {ProcessExamSheets} from "../pages/process_exam_sheets/process_exam_sheets";
import {FileUploadModule} from "ng2-file-upload";
import {AddExamPage} from "../pages/add_exam/add-exam";
import {SearchPipe} from '../pipes/search/search';
import {SortPipe} from "../pipes/sort/sort";
import {AngularCropperjsModule} from "angular-cropperjs";
import {DragulaModule, DragulaService} from "ng2-dragula";
import {PdfViewerComponent} from 'ng2-pdf-viewer';
import {PdfViewerPage} from "../pages/pdfViewer/pdf_viewer";
import {AddDraggleExamPage} from "../pages/add_draggable_exam/add_dynamic_draggable_exam";
import {Autoresize} from "./Autoresize";
import {GetElementDirective} from "./GetElementDirective";
import {GradingPage} from "../pages/grading/grading";
import {GradingDetailsPage} from "../pages/grading-details/grading-details";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {CropExamPage} from "../pages/crop-exam/crop-exam";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        TabsPage,
        ProcessExamSheets,
        AddExamPage,
        SearchPipe,
        SortPipe,
        AddDraggleExamPage,
        PdfViewerComponent,
        PdfViewerPage,
        Autoresize,
        GetElementDirective,
        GradingPage,
        GradingDetailsPage,
        CropExamPage
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        FileUploadModule,
        IonicModule.forRoot(MyApp),
        DragulaModule,
        AngularCropperjsModule,
        Ng2SmartTableModule,

    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        TabsPage,
        ProcessExamSheets,
        AddExamPage,
        PdfViewerPage,
        GradingPage,
        GradingDetailsPage,
        AddDraggleExamPage,
        CropExamPage
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AutomatedExamService,
        DragulaService
    ]
})
export class AppModule {
}