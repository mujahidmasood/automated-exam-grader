import {Component} from '@angular/core';

import {HomePage} from '../home/home';
import {ProcessExamSheets} from "../process_exam_sheets/process_exam_sheets";
import {GradingPage} from "../grading/grading";
import {AddDraggleExamPage} from "../add_draggable_exam/add_dynamic_draggable_exam";
import {CropExamPage} from "../crop-exam/crop-exam";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1 = HomePage;
    tab2 = ProcessExamSheets;
    tab3 = GradingPage;

    constructor() {
    }
}
