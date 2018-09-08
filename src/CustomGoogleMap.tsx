import * as React from 'react';
import './CustomGoogleMap.css';

import {GoogleMap, Marker, withGoogleMap, withScriptjs} from 'react-google-maps';

let defaultZoom = 10;
let defaultCenter = { lat: -34.397, lng: 150.644 };

const MyGoogleMap = withScriptjs(withGoogleMap((props) => {
  return <GoogleMap
    defaultZoom={defaultZoom}
    defaultCenter={defaultCenter}
    options={{ disableDefaultUI: true }}>
      {props.children}
    </GoogleMap>
  }
))

export const googleMapURL = 'https://maps.googleapis.com/maps/api/js'//?key=AIzaSyDwhc7v2AEgOevSNl06LikOo6Zo66szxJ8'

class CustomGoogleMap extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    defaultZoom = props.defaultZoom;
    defaultCenter = props.defaultCenter;
  }

  public render() {
    const loadingElement = <div></div>
    const containerElement = <div style={{height: '100%'}}/>
    const mapElement = <div style={{height: '100%'}}/>

    const { markers } = this.props;
    return (
      <div style={{width: '100%', height: '100%'}}>
        <MyGoogleMap
          loadingElement={loadingElement}
          containerElement={containerElement}
          mapElement={mapElement}
          googleMapURL={googleMapURL}
        >
          {
            markers.map((marker: any, idx: number) => {
              return (
                <Marker
                  key={idx}
                  position={marker}
                />
              )
            })
          }
        </MyGoogleMap>
      </div>
    );
  }
}

export default CustomGoogleMap;
