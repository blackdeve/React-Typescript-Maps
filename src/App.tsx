import * as React from 'react';
import './App.css';

import * as firebase from "./firebase";

import CustomGoogleMap from './CustomGoogleMap';
import SearchResultItem from './SearchResultItem';

const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  var radlat1 = Math.PI * lat1 / 180
  var radlat2 = Math.PI * lat2 / 180
  var theta = lon1 - lon2
  var radtheta = Math.PI * theta / 180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515
  dist = dist * 1.609344; // for kilometers
  return dist
}

class App extends React.Component<any, any> {
  zipInput: any;
  radiusInput: any;

  constructor(props: any) {
    super(props);

    this.state = {
      shopData: [],
      results: []
    }

    this.loadDataFromFirebase();
  }

  loadDataFromFirebase() {
    firebase.db.ref().child('shops').once('value')
    .then(res => {
      let shopData = res.val();
      const list: any = [];
      for (var key in shopData) {
        list.push(shopData[key]);
      }
      this.setState({shopData: list, results: list})
    })
  }

  onZipcodeChangeHandler(e: any) {
    const zipcode = e.target.value;
    this.setState({ zipcode });
  }
  
  applyFilter() {
    let THAT: any = this;
    const zip = this.zipInput.value;
    const radius = this.radiusInput.value;

    const { shopData } = this.state;

    var lat: any;
    var lng: any;
    var address = zip;
    var geocoder: any = new google.maps.Geocoder();
    geocoder.geocode( {'address': address}, function(results: any, status: any) {
      if (status == google.maps.GeocoderStatus.OK) {
        lat = parseFloat(results[0].geometry.location.lat());
        lng = parseFloat(results[0].geometry.location.lng());
        
        const searchResults:any = [];

        shopData.map((item: any) => {
          let dist:any = distance(lat, lng, item.latlng.lat, item.latlng.lng);
          if (dist <= radius) {
            searchResults.push(item);
          }
        })

        THAT.setState({ results: searchResults });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  public render() {
    const first: any = [];
    const second: any = [];
    const third: any = [];
    const results: any = this.state.results;
    let i: number;
    for (i = 0; i < results.length; i += 3) first.push(results[i])
    for (i = 1; i < results.length; i += 3) second.push(results[i])
    for (i = 2; i < results.length; i += 3) third.push(results[i])

    return (
      <div className="App">
        <div className="container">
          <div className="mapContainer">
            <div className="map">
              <CustomGoogleMap
                defaultZoom={11}
                defaultCenter={{ lat: 49.267984, lng: - 123.112960 }}
                markers={this.state.results.map((item:any) => item.latlng)}
              />
            </div>
            <div className="filter">
              <div className="halfside">
                <span className="filterName">ZIP CODE / POSTAL CODE</span>
                <input ref={r => this.zipInput = r} className="filterInput" type="text" name="radius" id="zip" />
                <span className="filterLabel" onClick={this.applyFilter.bind(this)}>Search Results</span>
              </div>
              <div className="halfside">
                <span className="filterName">SELECT RADIUS</span>
                <select ref={r => this.radiusInput = r} className="filterInput" name="radius" id="radius">
                  <option value="9999999">No Limit</option>
                  {
                    new Array(100).fill(null).map((item:any, idx:any) => (
                      <option key={idx} value={`${idx+1}`}>{idx + 1} km</option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>

          <div className="searchResults">
            <div className="listColumn">
              {
                first.map((item: any, idx: any) => 
                  <SearchResultItem
                    key={idx}
                    location={item.location}
                    address={item.address}
                    email={item.email}
                    phone={item.phone}
                  />
                )
              }
            </div>
            <div className="listColumn">
              {
                second.map((item: any, idx: any) =>
                  <SearchResultItem
                    key={idx}
                    location={item.location}
                    address={item.address}
                    email={item.email}
                    phone={item.phone}
                  />
                )
              }
            </div>
            <div className="listColumn">
              {
                third.map((item: any, idx: any) =>
                  <SearchResultItem
                    key={idx}
                    location={item.location}
                    address={item.address}
                    email={item.email}
                    phone={item.phone}
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
