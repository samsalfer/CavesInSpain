import { Component, ViewChild, ElementRef } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';

import { Platform } from 'ionic-angular';


declare var google: any;


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor(public confData: ConferenceData, public platform: Platform) {
  }

  ionViewDidLoad() {

    let notify = function() {

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      }

      function showPosition(position) {
          localStorage.setItem("longitude", position.coords.longitude);
          localStorage.setItem("latitude", position.coords.latitude);
      }

    }

    notify();

      this.confData.getMap().subscribe((mapData: any) => {
        let mapEle = this.mapElement.nativeElement;

        let longitude = localStorage.getItem("longitude");
        let latitude = localStorage.getItem("latitude");

        let myLatlng = new google.maps.LatLng(latitude, longitude);

        let map = new google.maps.Map(mapEle, {
          center: myLatlng,
          zoom: 10
        });

        mapData.forEach((markerData: any) => {
          let infoWindow = new google.maps.InfoWindow({
            content: `<h5>${markerData.name}</h5>`
          });

          let marker = new google.maps.Marker({
            position: markerData,
            map: map,
            title: markerData.name
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });

        google.maps.event.addListenerOnce(map, 'idle', () => {
          mapEle.classList.add('show-map');
        });

      });

  }
}
