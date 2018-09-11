import * as React from "react";

import "./SearchResultItem.css";

interface Props {
  address: string,
  email: string,
  location: string,
  phone: string
};

export default class SearchResultItem extends React.Component<Props, object> {
  public render() {
    const { address, email, location, phone } = this.props;
    
    return (
      <div className="searchResultItem">
        <div className="itemLocation">{location}</div>
        <div>
          <div className="itemLabel"><div></div>{address}</div>
          <div className="itemLabel"><div></div>{email}</div>
          <div className="itemLabel"><div></div>{phone}</div>
        </div>
      </div>
    );
  }
}
