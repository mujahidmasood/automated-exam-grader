import { Observable } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class AutomatedExamService {
  serviceUrl = 'http://localhost:9090/';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  // Simple in-memory store to pass data between routed pages
  // (replaces Ionic v3 NavParams).
  private navData: { [key: string]: any } = {};

  constructor(
    private http: HttpClient,
    private translateService: TranslateService
  ) {}

  setNavData(key: string, value: any) {
    this.navData[key] = value;
  }

  getNavData(key: string): any {
    return this.navData[key];
  }

  addExam(exam: any): Observable<any> {
    const requestUrl = this.serviceUrl + 'exam/addExam';
    return this.http.post(requestUrl, exam, { headers: this.headers });
  }

  getUnProcessedSheets(): Observable<any> {
    const requestUrl = this.serviceUrl + 'exam/getUnprocessedSheets';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  saveProcessingData(processingData: any): Observable<any> {
    const requestUrl = this.serviceUrl + 'exam/saveProcessingData';
    return this.http.post(requestUrl, processingData, {
      headers: this.headers,
    });
  }

  deleteExam(unProcessedExam: any): Observable<any> {
    const requestUrl = this.serviceUrl + 'exam/deleteExam';
    return this.http.request('DELETE', requestUrl, {
      headers: this.headers,
      body: unProcessedExam,
    });
  }

  /** Returns the application's current language. */
  getCurrentLang(): string {
    return this.translateService.currentLang;
  }

  /** Changes the selected language of the user. */
  changeLanguage(selectedLang: string) {
    this.translateService.setDefaultLang(selectedLang);
    this.translateService.use(selectedLang);
  }

  uploadExamSheets(
    selectedFiles: FileList,
    processExamForm: any
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('examFolder', processExamForm.inputExamSheetsDirectory);
    formData.append('reorderExams', processExamForm.reorderExams.toString());
    formData.append('examId', processExamForm.id);

    for (let index = 0; index < selectedFiles.length; index++) {
      formData.append('file', selectedFiles[index]);
    }

    const requestUrl = this.serviceUrl + 'examfile/uploadExamSheets';

    return this.http.post(requestUrl, formData, {
      reportProgress: true,
      responseType: 'text',
      observe: 'events',
    });
  }

  getFiles(examFolder: string): Observable<any> {
    const requestUrl = this.serviceUrl + 'examfile/getallfiles';
    const params = new HttpParams().set('examFolder', examFolder);
    return this.http.get(requestUrl, { params });
  }

  getScannedExamSheet(examFolder: string, fileName: string): Observable<any> {
    const requestUrl = this.serviceUrl + 'examfile/filedetails';
    const params = new HttpParams()
      .set('examFolder', examFolder)
      .set('fileName', fileName);
    return this.http.get(requestUrl, { params, responseType: 'blob' });
  }

  deleteStudentExamSheet(
    examFolder: string,
    fileName: string
  ): Observable<any> {
    const requestUrl = this.serviceUrl + 'examfile/deleteStudentExamSheet';
    return this.http.request('DELETE', requestUrl, {
      headers: this.headers,
      body: { examFolder, fileName },
    });
  }

  getGradedExams(): Observable<any> {
    const requestUrl = this.serviceUrl + 'grades/getGradedExams';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  deleteGrading(gradedExam: any): Observable<any> {
    const requestUrl = this.serviceUrl + 'grades/deleteGradedExam';
    return this.http.request('DELETE', requestUrl, {
      headers: this.headers,
      body: gradedExam,
    });
  }

  getImage(
    examFolder: string,
    fileName: string,
    answerCoordinates: string
  ): Observable<any> {
    const requestUrl = this.serviceUrl + 'examfile/getImage';
    const params = new HttpParams()
      .set('examFolder', examFolder)
      .set('fileName', fileName)
      .set('answerCoordinates', answerCoordinates);
    return this.http.get(requestUrl, { params });
  }

  updateGrades(gradedExam: any): Observable<any> {
    const requestUrl = this.serviceUrl + 'grades/updateGradedExam';
    return this.http.post(requestUrl, gradedExam, { headers: this.headers });
  }
}
