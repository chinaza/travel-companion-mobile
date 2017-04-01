import { Component } from '@angular/core';
import { Platform, LoadingController, NavParams } from 'ionic-angular';
import {
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapsLatLng,
  CameraPosition,
  GoogleMapsMarkerOptions,
  GoogleMapsMarker,
  GoogleMapsMarkerIcon
} from 'ionic-native';

import {SmsParser, Location} from '../../providers/sms-parser';
import {QuickFunc} from '../../providers/quickfunc';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  private map;
  public bagData:{
    lat: number,
    lng: number
  } = {
    lat: null,
    lng: null
  };
  private bagId: string;
  public modalhide:boolean = true;

  constructor(
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private navParams: NavParams,
    private smsParser: SmsParser,
    private quickFunc: QuickFunc
  ){
  }

  ionViewDidLoad(){

    this.platform.ready().then(() => { //When platform is ready, load google maps and add markers indicating bus stops
      this.getLocation();
    });
  }

  private initMap(): void{
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    this.map = new GoogleMap(element); //Create map element

    // listen to MAP_READY event
    this.map.one(GoogleMapsEvent.MAP_READY).then(() =>{
      console.log('Map is ready!');
      this.map.setMapTypeId("MAP_TYPE_HYBRID"); //Set map type to Hybrid
      this.initLocation(this.bagData.lat, this.bagData.lng);
    });
  }

  private getLocation(){
    this.quickFunc.prompAlert('Bag ID', 'Enter your Bag ID').then(stat=>{
      if (stat.status && stat.prompt == "074"){
        this.bagId = stat.prompt
        //let timeoutc:boolean = true;
        let loading = this.loadingCtrl.create({
          content: 'Please chill...'
        });
        loading.present();

        this.smsParser.reqLocation(stat.prompt).then(location=>{
          loading.dismiss();
          this.bagData.lat = location.lat;
          this.bagData.lng = location.long;
          this.initMap();
        });
      } else {
        this.quickFunc.showAlert("Status", "Invalid Bag ID");
      }
    });
  }

  public initLocation(lat:number, lng:number): void{
    //Declare custom image for markers
    console.log('lat: ' + lat + ' lng: ' + lng + ' typelat: ' + typeof(lat) + ' typelng: ' + typeof(lng));
    let image:GoogleMapsMarkerIcon = {
      url: './assets/img/pin.png',
      size:{width: 40, height:64}
    };

    let markerOptions: GoogleMapsMarkerOptions = {
      position: new GoogleMapsLatLng(lat, lng),
      title: "Bag " + this.bagId + " Location",
      icon: image
    };

    this.map.addMarker(markerOptions)
    .then((marker: GoogleMapsMarker) => {
      marker.showInfoWindow();
    });

    // create CameraPosition
    let position: CameraPosition = {
      target: new GoogleMapsLatLng(lat, lng),
      zoom: 17,
      tilt: 40
    };

    // move the map's camera to position
    this.map.moveCamera(position);
  }

}
