import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SelBagPage } from '../pages/sel-bag/sel-bag';
import { BtComm } from '../providers/bt-comm';

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
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, BtComm]
})
export class AppModule {}
