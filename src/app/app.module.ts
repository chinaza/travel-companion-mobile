import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SelBagPage } from '../pages/sel-bag/sel-bag';
import { BtComm } from '../providers/bt-comm';
import { SmsParser } from '../providers/sms-parser';
import { QuickFunc } from '../providers/quickfunc';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SelBagPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SelBagPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BtComm,
    SmsParser,
    QuickFunc
  ]
})
export class AppModule {}
