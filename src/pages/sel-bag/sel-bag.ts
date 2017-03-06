import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import {BtComm, Bag} from '../../providers/bt-comm';

import {SmsParser} from '../../providers/sms-parser';

import { HomePage } from '../home/home';
/*
Generated class for the SelBag page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/
@Component({
  selector: 'page-sel-bag',
  templateUrl: 'sel-bag.html'
})
export class SelBagPage {

  private _bags:Array<Bag>;
  bags:Array<Bag>;
  query: string = "";
  public pushPage:any = HomePage;
  public params = { task: 'retrLocation' };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private btComm: BtComm,
    private smsParser: SmsParser
  ) {
  }

  ionViewDidLoad() {
    this.loadBags();
  }

  private loadBags():void{
    this._bags = [];
    this.btComm.getBags().then(bags=>{
      bags.subscribe(bag=>{
        this._bags.push(bag);
      },
      ()=>{},
      ()=>{
        this.bags = this._bags;
      }
    );
  });
}

private initializeBags():void{
  this.bags = this._bags;
}

public getBags(ev: any) {
  // Reset items back to all of the items
  this.initializeBags();

  // set val to the value of the searchbar
  let val = ev.target.value;

  // if the value is an empty string don't filter the items
  if (val && val.trim() != '') {
    this.bags = this._bags.filter((bag) => {
      return (bag.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
    })
  } else {
    this.initializeBags();
  }
}

connectBag(bag:Bag){
  this.btComm.connectBag(bag)
  .then(state=>state?this.navCtrl.setRoot(HomePage):console.log('failed'))
  .catch(err=>console.log('failed_with_error'));
}


}
