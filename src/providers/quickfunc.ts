import {Injectable} from '@angular/core';
import {AlertController, LoadingController} from 'ionic-angular';

@Injectable()
export class QuickFunc {

  constructor (
    public alertController: AlertController,
    public loadingCtrl: LoadingController
  ){
  }

public presentLoading():any {
  let loader = this.loadingCtrl.create({
    content: "Connecting...",
    dismissOnPageChange: true
  });
  loader.present();
  return loader;
}

  public prompAlert(title:string, message:string, btnOK:string = "OK", btnCancel:string = "Cancel", btnClass?:string):Promise<{status:boolean, prompt:string}>{
    return new Promise((resolve, reject)=>{
      let prompt = this.alertController.create({
        title: title,
        message: message,
        enableBackdropDismiss: false,
        inputs: [
          {
            name: 'input',
            placeholder: ''
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
              let navTransition = prompt.dismiss();
              navTransition.then(() => {
                resolve({
                  status: false,
                  prompt: ''
                });
              });
            }
          },
          {
            text: btnOK,
            cssClass: btnClass,
            handler: data => {
              let navTransition = prompt.dismiss();
              navTransition.then(() => {
                if (data){
                  resolve({
                    status: true,
                    prompt: data.input
                  });
                } else {
                  resolve({
                    status: true,
                    prompt: ''
                  });
                }
              });
            }
          }
        ]
      });
      prompt.present();
    });
  }

  public showAlert(title:string, message:string, btnType:string = 'OK', css?:string):Promise<boolean>{
    return new Promise((resolve, reject) => {
      css = css?css:'';
      let alertPopup = this.alertController.create({
        title: title,
        subTitle: message,
        enableBackdropDismiss: false,
        cssClass: 'alertcss',
        buttons: [{
          text: btnType,
          cssClass: css,
          handler: ()=>{
            let navTransition = alertPopup.dismiss();
            navTransition.then(() => {
              resolve(true);
            });
          }
        }]
      });
      alertPopup.present();
    });
  }

  public showConfirm(title:string, message:string, btnOK:string = "OK", btnCancel:string = "Cancel"):Promise<boolean>{
    return new Promise((resolve, reject) => {
      let stat = false;
      let confirmPopup = this.alertController.create({
        title: title,
        enableBackdropDismiss: false,
        message: message,
        cssClass: 'alertcss',
        buttons: [
          {
            text: btnCancel,
            handler: () => {
              stat = false;
              let navTransition = confirmPopup.dismiss();
              navTransition.then(() => {
                resolve(stat);
              });
              console.log('canceled');
            }
          },
          {
            text: btnOK,
            handler: () => {
              stat = true;
              console.log('OK');
              let navTransition = confirmPopup.dismiss();
              navTransition.then(() => {
                resolve(stat);
              });
            }
          }
        ]
      });
      confirmPopup.present();
    });
  }

/*
  public selectAlert(title:string, data:Array<{type:string, label:string, value:string}>, btnOK:string = "OK", btnCancel:string = "Cancel"):Observable<any>{
    return Observable.create(observer => {
      let alert = this.alertController.create({
        title: title
      });
      if (data.length > 0){
        let i: number = 0;
        let dl: number = data.length;
        for (i = 0; i < dl; i++){
          alert.addInput({
            type: 'radio',
            label: data[i].label,
            value: data[i].value,
            checked: false
          });
        }
      }
    });
  }
*/


}
