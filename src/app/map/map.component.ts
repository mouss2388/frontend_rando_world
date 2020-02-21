import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE, DEFAULT_LATITUDE2, DEFAULT_LONGITUDE2 } from '../app.constants';
import { MapPoint } from '../shared/models/map-point.model';
import { NominatimResponse } from '../shared/models/nominatim-response.model';
import 'leaflet-routing-machine';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map: L.Map;
  mapPoint: MapPoint;
  mapPoint2: MapPoint;
  options: L.MapOptions;
  lastLayer: any;
  routingControl: L.Routing.Control;

  results: NominatimResponse[];
  results2: NominatimResponse[];

  constructor() {
  }

  ngOnInit() {
    
    this.initializeDefaultMapPoint();
    this.initializeMapOptions();
  }

  initializeMap(map: L.Map) {
    this.map = map;
    this.createMarker();
    this.routingControl = L.Routing.control({
      waypoints: [
        L.latLng(this.mapPoint.latitude, this.mapPoint.longitude),
        L.latLng(this.mapPoint2.latitude, this.mapPoint2.longitude)
      ],
      routeWhileDragging: true,
    }).addTo(this.map);



  }

  getAddress(result: NominatimResponse, point: number) {
    this.updateMapPoint(result.latitude, result.longitude, point);
  }

  refreshSearchList(results: NominatimResponse[]) {
    this.results = results;
  }


  refreshSearchList2(results2: NominatimResponse[]) {
    this.results2 = results2;
  }

  private initializeMapOptions() {
    this.options = {
      zoom: 5,
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'OSM' })
      ]
    }
  }

  private initializeDefaultMapPoint() {
    this.mapPoint = {
      name: 'START',
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE
    };

    this.mapPoint2 = {
      name: 'FINISH',
      latitude: DEFAULT_LATITUDE2,
      longitude: DEFAULT_LONGITUDE2
    };
  }

  private onMapClick(e: L.LeafletMouseEvent) {
    this.clearMap();
    this.updateMapPoint(e.latlng.lat, e.latlng.lng, 0);
    //this.createMarker();
  }

  private updateMapPoint(latitude: number, longitude: number, point: number, name?: string, ) {
    // this.routingControl.getWaypoints[point-1].setWaypoints(
    //   L.latLng(latitude, longitude));
   
    let points : L.Routing.Waypoint[] = this.routingControl.getWaypoints();
    points[point - 1] = {latLng: L.latLng(latitude, longitude), name: name};

    this.routingControl.setWaypoints(points);
    /*
        [
          L.latLng(latitude, longitude),

           L.latLng(46.92025531537454, 5.449218750000001)
        ]
      )
    else
      this.routingControl[1].setWaypoints([
        L.latLng(latitude, longitude),
      ]);
*/
    this.mapPoint = {
      latitude: latitude,
      longitude: longitude,
      name: name ? name : this.mapPoint.name
    };
  }

  private createMarker() {
    this.clearMap();
    const mapIcon = this.getDefaultIcon();
    const coordinates = L.latLng([this.mapPoint.latitude, this.mapPoint.longitude]);
    //this.lastLayer = L.marker(coordinates).setIcon(mapIcon).addTo(this.map);
    this.map.setView(coordinates, this.map.getZoom());
  }

  private getDefaultIcon() {
    return L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/marker-icon.png'
    });
  }

  private clearMap() {
    if (this.map.hasLayer(this.lastLayer)) this.map.removeLayer(this.lastLayer);
  }

}
