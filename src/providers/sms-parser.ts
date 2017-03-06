import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
Generated class for the SmsParser provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/
declare var SMS;

export interface Location{
  lat: number,
  long: number,
  timestamp: number
}

@Injectable()
export class SmsParser {

  private trackerID:string;
  private SMS;

  constructor(public http: Http, public platform: Platform) {
    this.platform.ready().then(() => {
      this.SMS = SMS;
    });
  }

  public reqLocation(id:string):Promise<Location>{
    this.trackerID = '+234' + id;
    return new Promise((resolve, reject)=>{
      let reqString = "fix010s001n+password"; //Location request command
      this.SMS.sendSMS(id, reqString,
        ()=>{
          this.waitLocation().then((location)=>{
            resolve(location);
          }).catch(err=>{
            reject(err);
          });
        }, ()=>{
          reject('failed');
        });
      });
    }

    private waitLocation():Promise<Location>{
      return new Promise((resolve, reject)=>{
        this.SMS.startWatch(()=>{
          document.addEventListener('onSMSArrive', (e)=>{
            let smsEvent:any = e,
            sms = smsEvent.data;
            console.log(sms);
            if (this.SMS.address == this.trackerID){
              let location:Location = this.parseSMS(sms);
              console.log('location', location);
              resolve(location);
            }
          });
        }, ()=>{
          reject("failed");
        });
      });
    }

    private parseSMS(smsBody:string):Location{
      let latStart:number = smsBody.indexOf('lat:') + 5,
      latStop:number = smsBody.indexOf('long:'),
      lonStart:number = smsBody.indexOf('long:') + 6,
      lonStop:number = smsBody.indexOf('speed:'),
      lat:number = parseFloat(smsBody.substring(latStart, latStop)),
      long:number = parseFloat(smsBody.substring(lonStart, lonStop)),
      t = new Date();
      return {
        lat: lat,
        long: long,
        timestamp: t.getTime()
      };
    }


  }
