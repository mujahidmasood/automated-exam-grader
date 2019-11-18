#!/bin/bash

sudo npm install -g cordova ionic
sudo npm install @ngx-translate/core @ngx-translate/http-loader --save -g
sudo npm install rxjs -g
sudo npm install @angular/cli -g
npm install
ionic cordova plugin add cordova-plugin-whitelist
ionic cordova plugin add cordova-plugin-statusbar
ionic cordova plugin add cordova-plugin-device
ionic cordova plugin add cordova-plugin-ionic-webview
ionic cordova plugin add cordova-plugin-ionic-keyboard
ionic cordova plugin add cordova-sqlite-storage

npm install --save @ionic-native/sqlite
npm install --save @ionic-native/file

#data tables run with sudo
npm install jquery --save
npm install datatables.net --save
npm install datatables.net-dt --save
npm install angular-datatables --save
npm install @types/jquery --save
npm install @types/datatables.net --save
