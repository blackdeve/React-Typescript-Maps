import * as React from "react";
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";

import { LatLng } from './interface';

let defaultZoom = 10;
let defaultCenter = { lat: -34.397, lng: 150.644 };

const MyGoogleMap = withScriptjs(withGoogleMap((props) => (
  <GoogleMap
    defaultZoom={defaultZoom}
    defaultCenter={defaultCenter}
    options={{ disableDefaultUI: true }}>
      {props.children}
    </GoogleMap>
)))

const googleMapURL = "https://maps.googleapis.com/maps/api/js"//?key=AIzaSyDwhc7v2AEgOevSNl06LikOo6Zo66szxJ8"

interface Props {
  defaultCenter: LatLng
  defaultZoom: number,
  markers: LatLng[],
};

export default class CustomGoogleMap extends React.Component<Props, object> {
  constructor(props: Props) {
    super(props);
    defaultCenter = props.defaultCenter;
    defaultZoom = props.defaultZoom;
  }

  public render() {
    const containerElement = <div style={{height: "100%"}}/>;
    const loadingElement = <div></div>;
    const mapElement = <div style={{height: "100%"}}/>;
    const { markers } = this.props;

    return (
      <div style={{width: "100%", height: "100%"}}>
        <MyGoogleMap
          loadingElement={loadingElement}
          containerElement={containerElement}
          mapElement={mapElement}
          googleMapURL={googleMapURL}
        >
          {
            markers.map((marker: LatLng, idx: number) => (
                <Marker
                  key={idx}
                  position={marker}
                />
              ))
          }
        </MyGoogleMap>
      </div>
    );
  }
};
