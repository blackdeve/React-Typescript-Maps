import * as React from "react";

import * as firebase from "./firebase";
import CustomGoogleMap from "./CustomGoogleMap";
import SearchResultItem from "./SearchResultItem";
import { LatLng, Item } from './interface';

import "./App.css";

const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344; // for kilometers
  
  return dist;
}

interface State {
  results: object[],
  shopData: object[],
}

const tempArray = new Array(100).fill(null);

export default class App extends React.Component<object, State> {
  radiusInput: HTMLSelectElement;
  zipInput: HTMLInputElement;

  constructor(props: object) {
    super(props);

    this.state = {
      results: [],
      shopData: []
    };

    this.loadDataFromFirebase();
  }

  private async loadDataFromFirebase() {
    const res = await firebase.db.ref().child("shops").once("value");
    let shopData = res.val();
    let list: object[] = [];
    for (let key in shopData) {
        list.push(shopData[key] as object);
    }
    this.setState({shopData: list});
  }
  
  private applyFilter() {
    const radius:number = parseInt(this.radiusInput.value);
    const zip = this.zipInput.value;

    if (zip.length === 0) {
      alert("Zip / Postal Code can't be blank");
      return;
    }

    const { shopData } = this.state;

    let lat: number;
    let lng: number;
    const address = zip;
    const geocoder: google.maps.Geocoder = new google.maps.Geocoder();
    geocoder.geocode( {"address": address}, (results: {geometry: {location: {lat: Function, lng: Function}}}[], status: number) => {
      if (status === google.maps.GeocoderStatus.OK) {
        lat = parseFloat(results[0].geometry.location.lat());
        lng = parseFloat(results[0].geometry.location.lng());
        
        let searchResults:object[] = [];

        if (shopData) {
          shopData.map((item: {latlng: LatLng}) => {
            let dist:number = distance(lat, lng, item.latlng.lat, item.latlng.lng);
            if (dist <= radius) {
              if (searchResults !== undefined) {
                searchResults.push(item);
              }
            }
          });
        }

        this.setState({ results: searchResults });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  public render() {
    const columns: object[][] = [[], [], []];
    const results = this.state.results;
    let i: number;
    let j: number;
    for (i = 0; i < 3; i ++) {
      for (j = i; j < results.length; j += 3) columns[i].push(results[j]);
    }

    return (
      <div className="App">
        <div className="container">
          <div className="mapContainer">
            <div className="map">
              <CustomGoogleMap
                defaultZoom={11}
                defaultCenter={{ lat: 49.267984, lng: - 123.112960 }}
                markers={this.state.results ? this.state.results.map((item:{latlng: LatLng}) => item.latlng) : []}
              />
            </div>
            <div className="filter">
              <div className="filterInputContainer">
                <span className="filterName">ZIP CODE / POSTAL CODE</span>
                <input ref={(r) => this.zipInput = r as HTMLInputElement} className="filterInput" type="text" name="radius" id="zip" />
                <span className="filterLabel">Search Results</span>
              </div>
              <div className="filterInputContainer">
                <span className="filterName">SELECT RADIUS</span>
                <select ref={(r) => this.radiusInput = r as HTMLSelectElement} className="filterInput" name="radius" id="radius">
                  <option value="9999999">No Limit</option>
                  {
                    tempArray.map((item:object, idx:number) => (
                      <option key={idx} value={`${idx+1}`}>{idx + 1} km</option>
                    ))
                  }
                </select>
              </div>
              <div className="searchButtonContainer">
                <div className="searchButton" onClick={this.applyFilter.bind(this)}>Search</div>
              </div>
            </div>
          </div>

          <div className="searchResults">
            {
              results.length !== 0 ?
              columns.map((column: [], idx1: number) => (
                <div key={idx1} className={`listColumn${column.length === 0 ? " emptyColumn" : ""}`}>
                  {
                    column.map((item: Item, idx: number) => (
                      <SearchResultItem
                        key={idx}
                        location={item.location}
                        address={item.address}
                        email={item.email}
                        phone={item.phone}
                      />
                    ))
                  }
                </div>
              ))
              :
              <div className="noLocationMsg">
                No locations available
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
