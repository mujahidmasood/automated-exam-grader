import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'process',
        loadComponent: () =>
          import('./pages/process-exam-sheets/process-exam-sheets.page').then(
            (m) => m.ProcessExamSheetsPage
          ),
      },
      {
        path: 'grading',
        loadComponent: () =>
          import('./pages/grading/grading.page').then((m) => m.GradingPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'add-exam',
    loadComponent: () =>
      import('./pages/add-exam/add-exam.page').then((m) => m.AddExamPage),
  },
  {
    path: 'grading-details',
    loadComponent: () =>
      import('./pages/grading-details/grading-details.page').then(
        (m) => m.GradingDetailsPage
      ),
  },
  {
    path: 'pdf-viewer',
    loadComponent: () =>
      import('./pages/pdf-viewer/pdf-viewer.page').then((m) => m.PdfViewerPage),
  },
  {
    path: 'crop-exam',
    loadComponent: () =>
      import('./pages/crop-exam/crop-exam.page').then((m) => m.CropExamPage),
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];
