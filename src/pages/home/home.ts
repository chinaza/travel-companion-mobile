import { Component } from '@angular/core';
import { Platform, LoadingController, AlertController, NavParams } from 'ionic-angular';
import {
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapsLatLng,
  CameraPosition,
  GoogleMapsMarkerOptions,
  GoogleMapsMarker,
  GoogleMapsMarkerIcon
} from 'ionic-native';

import {BtComm, Bag} from '../../providers/bt-comm';


declare var io;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  private map;
  private socketHost:string;
  public bagData:{
    weight: string,
    lat: string,
    lng: string
  };
  public modalhide:boolean = true;

  constructor(
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private btComm: BtComm
  ){
    this.bagData = {
      weight: "--",
      lat: "",
      lng: ""
    };
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => { //When platform is ready, load google maps and add markers indicating bus stops
      this.initMap();
      if (this.navParams.data.task != "retrLocation"){
        this.getWeight();
      }
    });
  }

  private getWeight(){
    this.btComm.requestWeight().then(weight=>{
      this.bagData.weight = weight;
    });
  }

  private initMap(): void{
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    this.map = new GoogleMap(element); //Create map element

    this.map.setMapTypeId("MAP_TYPE_HYBRID"); //Set map type to HYBRID

    // listen to MAP_READY event
    this.map.one(GoogleMapsEvent.MAP_READY).then(() =>{
      console.log('Map is ready!');
      this.initLocation(6.675943, 3.162387);
    });
  }

  public getData(): void{
    let timeoutc:boolean = true;
    let loading = this.loadingCtrl.create({
      content: 'Please chill...'
    });
    loading.present();
    console.log("Requesting data...");
    this.socketHost = "http://172.16.16.101:5000";
    let socket = io(this.socketHost);
    socket.emit("BagData", {cmd:"GetBagData", id: "12adb1"});
    console.log("Emitting data...");
    setTimeout(()=>{
      if (timeoutc){
        //Show alert and cancel Loading
        loading.dismiss();
        this.modalhide = false;
        let alert = this.alertCtrl.create({
          title: 'Poor network',
          subTitle: 'Sorry, Failed to get to your bag',
          buttons: ['Dismiss']
        });
        alert.present();
        alert.onDidDismiss((data)=>{
          this.modalhide = true;
        })
      }
    }, 10000)
    socket.on("BagData", (data:any) => {
      timeoutc = false;
      //Cancel Loading...
      console.log(data);
      this.bagData = data;
      this.initLocation(parseFloat(this.bagData.lat), parseFloat(this.bagData.lng));
      loading.dismiss();
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
      title: "Bag's Location",
      icon: image
    };

    this.map.addMarker(markerOptions)
    .then((marker: GoogleMapsMarker) => {
      marker.showInfoWindow();
    });

    // create CameraPosition
    let position: CameraPosition = {
      target: new GoogleMapsLatLng(lat, lng),
      zoom: 12,
      tilt: 40
    };

    // move the map's camera to position
    this.map.moveCamera(position);
  }

}
