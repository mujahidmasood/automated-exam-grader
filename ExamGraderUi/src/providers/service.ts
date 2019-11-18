import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {HttpEvent} from "../../node_modules/@angular/common/http";

@Injectable()
export class AutomatedExamService {

    serviceUrl = "http://localhost:9090/";

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });


    constructor(private http: HttpClient,
                private translateService: TranslateService) {
    }

    addExam(exam): Observable<any> {
        let requestUrl = this.serviceUrl + "exam/addExam";
        return <Observable<any>> this.http.post(requestUrl, exam, {headers: this.headers})
    }

    getUnProcessedSheets(): Observable<any> {
        let requestUrl = this.serviceUrl + "exam/getUnprocessedSheets"
        return <Observable<any>> this.http.get(requestUrl, {
            headers: this.headers
        });
    }

    saveProcessingData(processingData): Observable<any> {
        let requestUrl = this.serviceUrl + "exam/saveProcessingData";
        console.log("ProcessingData = ", processingData)
        return <Observable<any>> this.http.post(requestUrl, processingData, {headers: this.headers})
    }

    deleteExam(unProcessedExam) {
        let requestUrl = this.serviceUrl + "exam/deleteExam";
        console.log("unProcessedExam", unProcessedExam);


        return <Observable<any>> this.http.request('DELETE', requestUrl, {
            headers: this.headers,
            body: unProcessedExam
        });
    }

    /**
     * Returns Application's current language
     */
    getCurrentLang(): string {
        return this.translateService.currentLang
    }

    /**
     * Changes the selected language of user
     * @param selectedLang
     */
    changeLanguage(selectedLang: string) {
        this.translateService.setDefaultLang(selectedLang)
        this.translateService.use(selectedLang)
    }

    uploadExamSheets(selectedFiles: FileList, processExamForm): Observable<HttpEvent<{}>> {

        const formData: FormData = new FormData();
        formData.append("examFolder", processExamForm.inputExamSheetsDirectory);
        formData.append("reorderExams", processExamForm.reorderExams.toString());
        formData.append("examId", processExamForm.id);

        for (let index = 0; index < selectedFiles.length; index++) {
            formData.append("file", selectedFiles[index]);
        }

        let requestUrl = this.serviceUrl + "examfile/uploadExamSheets";


        return <Observable<any>> this.http.post(requestUrl, formData, {
            reportProgress: true,
            responseType: 'text',
            observe: 'events'
        });
    }


    getFiles(examFolder): Observable<any> {
        let requestUrl = this.serviceUrl + "examfile/getallfiles";
        let params = new HttpParams()
            .set("examFolder", examFolder)

        return this.http.get(requestUrl, {params: params});
    }

    getScannedExamSheet(examFolder, fileName): Observable<any> {
        let requestUrl = this.serviceUrl + "examfile/filedetails";
        console.log(requestUrl)

        let params = new HttpParams()
            .set('examFolder', examFolder)
            .set("fileName", fileName)

        return this.http.get(requestUrl, {
            params: params,
            responseType: "blob"
        });
    }

    deleteStudentExamSheet(examFolder, fileName) {
        let requestUrl = this.serviceUrl + "examfile/deleteStudentExamSheet";

        return <Observable<any>> this.http.request('DELETE', requestUrl, {
            headers: this.headers,
            body: {
                examFolder: examFolder,
                fileName: fileName
            }
        });

    }

    getGradedExams() {
        let requestUrl = this.serviceUrl + "grades/getGradedExams";
        return <Observable<any>> this.http.get(requestUrl, {
            headers: this.headers
        })
    }

    deleteGrading(gradedExam) {
        let requestUrl = this.serviceUrl + "grades/deleteGradedExam";
        console.log("gradedExam", gradedExam);


        return <Observable<any>> this.http.request('DELETE', requestUrl, {
            headers: this.headers,
            body: gradedExam
        });
    }

    getImage(examFolder, fileName, answerCoordinates) {
        let requestUrl = this.serviceUrl + "examfile/getImage";

        let params = new HttpParams()
            .set('examFolder', examFolder)
            .set('fileName', fileName)
            .set("answerCoordinates", answerCoordinates)

        console.log("params = ", params);
        return this.http.get(requestUrl, {
            params: params
        });
    }

    updateGrades(gradedExam) {
        let requestUrl = this.serviceUrl + "grades/updateGradedExam";
        return <Observable<any>> this.http.post(requestUrl, gradedExam, {headers: this.headers})
    }

}
