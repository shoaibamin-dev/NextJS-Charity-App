import React from 'react';


import {
   
    Form
  
  } from '@/_shared/ui';
  import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';
  
  import Geocode from "react-geocode";
  
  
  Geocode.setApiKey("AIzaSyD7LJWUjhXEiyR_nfA2Cv1AXmqSfcR_Bw4");

export default class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    
  //  console.log(this.props,"From autocomplete")
    this.state = { address: this.props.cur_address ||  '' };
  }

  handleChange = address => {
      //console.log(address,'address')
    this.setState({ address });
  };

  handleSelect = address => {
    // let splitAddress = address.split(',');
    // let city = splitAddress[splitAddress.length - 2];
    // let country = splitAddress[splitAddress.length - 1];


    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {

        const { lat, lng } = latLng;
        Geocode.fromLatLng(lat, lng).then(
          (response) => {
            let address_result = response.results[0].formatted_address;

            console.log("address=>", response.results[0]);

            let city, state, country, zip_code;
            for (let i = 0; i < response.results[0].address_components.length; i++) {
              for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
                switch (response.results[0].address_components[i].types[j]) {
                  case "locality":
                    city = response.results[0].address_components[i].long_name;
                    address_result = address_result.replace(city.trim(), '')
                    console.log("after removed city=>", city, address_result)
                    break;
                  case "administrative_area_level_1":
                    state = response.results[0].address_components[i].long_name;
                    address_result =  address_result.replace(state.trim(), '')
                    break;
                  case "country":
                    country = response.results[0].address_components[i].long_name;
                    address_result = address_result.replace(country.trim(), '')
                    break;
                  case "postal_code":
                    zip_code = response.results[0].address_components[i].long_name;
                    address_result = address_result.replace(zip_code.trim(), '')
                    break;
                }
              }
            }
            // console.log(city, state, country, zip_code);
            // console.log(address);
            address_result = address_result.replace(',','');
            
            let short_address = address_result.split(',')[0]
        this.props.updateRegions(short_address, city, country, zip_code,state);
            this.setState({ address:short_address });

          },
          (error) => {
            console.error(error);
          }
        );
        console.log('Success', latLng)


      })
      .catch(error => console.error('Error', error));
  };

  render() {
    return (
      <PlacesAutocomplete
      value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            
          <div>
          
            <input
              {...getInputProps({
                placeholder: 'Address',
                className: 'location-search-input input-form w-95'   
              })}
             
             
              
              
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion,idx) => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                    key={idx}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}