import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {BluetoothSerial} from 'ionic-native';
import {Observable, Subscription} from 'rxjs';

/*
Generated class for the BtComm provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/
export interface Bag{
  address: string,
  class: number,
  id: string,
  name: string
}

@Injectable()
export class BtComm {
  private btConn = BluetoothSerial;
  private bagConn:Subscription;

  constructor(public http: Http) {
  }

  public getBags():Promise<Observable<any>>{
    return new Promise((resolve, reject)=>{
      let Bags:Observable<any>;
      this.btConn.list().then(devices=>{
        Bags = Observable.from(devices).filter(device=>{return device['name'].endsWith("tBag")});
        resolve(Bags);
      });
    });
  }

  public connectBag(bag:Bag):Promise<boolean>{
    return new Promise((resolve, reject)=>{
      this.btConn.isEnabled()
      .then(()=>{
        console.log(bag.address);
        this.bagConn = this.btConn.connect(bag.address)
        .subscribe(()=>{
          resolve(true);
        },
        ()=>{
          console.log('from here');
          reject(false);
        });
      })
      .catch(()=>{
        reject(false);
      });
    });
  }

  public requestWeight():Promise<string>{
    return new Promise((resolve, reject)=>{
      this.btConn.write('getWeight').then(
        ()=>{
          let weightOb = this.btConn.subscribe('\n').subscribe(data=>{
            weightOb.unsubscribe();
            resolve(data);
          });
        }
      ).catch(
        (err)=>{
          reject(err);
        }
      )
    });
  }

}
