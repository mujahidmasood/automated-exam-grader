import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';

import {LangChangeEvent, TranslateService} from "@ngx-translate/core";

import {TabsPage} from "../pages/tabs/tabs";
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = TabsPage;

    constructor(
        platform: Platform,
        translateService: TranslateService) {

        platform.ready().then(() => {

            translateService.use('en');
            translateService.setDefaultLang('en');

            translateService.onLangChange.subscribe((event: LangChangeEvent) => {
                if (event.lang == 'en' || event.lang == 'de') {
                    platform.setDir('ltr', true);
                    platform.setDir('rtl', false);
                } else {
                    platform.setDir('rtl', true);
                    platform.setDir('ltr', false);
                }
            });
        });
    }


}

