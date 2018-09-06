import * as React from 'react';
import './App.css';

import CustomGoogleMap from './CustomGoogleMap';
import SearchResultItem from './SearchResultItem';

const dummyData = [
  {
    geocode: { lat: 49.247402, lng: -123.167404 },
    location: 'Locaion 1',
    address: 'Address 1',
    email: 'Email 1',
    phone: 'Phone Number 1'
  },
  {
    geocode: { lat: 49.193881, lng: -123.099359 },
    location: 'Locaion 2',
    address: 'Address 2',
    email: 'Email 2',
    phone: 'Phone Number 2'
  },
  {
    geocode: { lat: 49.272727, lng: -123.052634 },
    location: 'Locaion 3',
    address: 'Address 3',
    email: 'Email 3',
    phone: 'Phone Number 3'
  },
  {
    geocode: { lat: 49.238247, lng: -123.044633 },
    location: 'Locaion 4',
    address: 'Address 4',
    email: 'Email 4',
    phone: 'Phone Number 4'
  },
  {
    geocode: { lat: 49.257072, lng: -123.108163 },
    location: 'Locaion 5',
    address: 'Address 5',
    email: 'Email 5',
    phone: 'Phone Number 5'
  },
  // {
  //   geocode: { lat: 49.246936, lng: -123.143338 },
  //   location: 'Locaion 6',
  //   address: 'Address 6',
  //   email: 'Email 6',
  //   phone: 'Phone Number 6'
  // },
  // {
  //   geocode: { lat: 49.231874, lng: -123.102442 },
  //   location: 'Locaion 7',
  //   address: 'Address 7',
  //   email: 'Email 7',
  //   phone: 'Phone Number 7'
  // }
]

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
      results: dummyData
    }
  }

  onZipcodeChangeHandler(e: any) {
    const zipcode = e.target.value;
    this.setState({ zipcode });
  }
  
  applyFilter() {
    let THAT: any = this;
    const zip = this.zipInput.value;
    const radius = this.radiusInput.value;

    var lat: any;
    var lng: any;
    var address = zip;
    var geocoder: any = new google.maps.Geocoder();
    geocoder.geocode( {'address': address}, function(results: any, status: any) {
      if (status == google.maps.GeocoderStatus.OK) {
        lat = parseFloat(results[0].geometry.location.lat());
        lng = parseFloat(results[0].geometry.location.lng());
        
        const searchResults:any = [];

        dummyData.map((item: any) => {
          let dist:any = distance(lat, lng, item.geocode.lat, item.geocode.lng);
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
                markers={this.state.results.map((item:any) => item.geocode)}
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
