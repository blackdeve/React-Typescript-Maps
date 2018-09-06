import * as React from 'react';
import './SearchResultItem.css';

class SearchResultItem extends React.Component<any, any> {
  public render() {
    const { location, address, email, phone } = this.props;
    return (
      <div className="searchResultItem">
        <div className="itemLocation">{location}</div>
        <div>
          <div className="itemLabel"><div></div>{address}</div>
          <div className="itemLabel"><div></div>{email}</div>
          <div className="itemLabel"><div></div>{phone}</div>
        </div>
      </div>
    )
  }
}

export default SearchResultItem;