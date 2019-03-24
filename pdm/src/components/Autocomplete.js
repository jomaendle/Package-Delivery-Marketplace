import React, { Component } from 'react';
import '../App.css';
import { withAuthentication } from "../Session";
import Script from 'react-load-script';
require('dotenv').config();

export class Autocomplete extends Component {

    constructor() {
        super();
        this.state = {
            googleAPIKey: process.env.REACT_APP_GOOLE_API_KEY,

            city: "",
            query: ""
        }
        this.handleScriptLoad = this.handleScriptLoad.bind(this);
        this.handlePlaceSelect = this.handlePlaceSelect.bind(this);


    }

    handleScriptLoad() { 
        // Declare Options For Autocomplete 
        var options = { types: ['(cities)'] }; 
        
        // Initialize Google Autocomplete 
        /*global google*/
        this.autocomplete = new google.maps.places.Autocomplete(
                              document.getElementById('autocomplete'),
                              options ); 
        // Fire Event when a suggested name is selected
        this.autocomplete.addListener('place_changed',
                                      this.handlePlaceSelect); 
    }


    handlePlaceSelect() {

        // Extract City From Address Object
        let addressObject = this.autocomplete.getPlace();
        let address = addressObject.address_components;
    
        // Check if address is valid
        if (address) {

            console.log(addressObject.geometry.location.lat())
          // Set State
          this.setState(
            {
              city: address[0].long_name,
              query: addressObject.formatted_address,
            }
          );
        }
      }


    render() {

        let googleMapURL = "https://maps.googleapis.com/maps/api/js?libraries=places&key=" + this.state.googleAPIKey;

        return (
            <div className="App">
             <Script url={googleMapURL} onLoad={this.handleScriptLoad}/>
                <input type="text" id="autocomplete" />         
            </div>
        );
    }
}

export default withAuthentication(Autocomplete);
