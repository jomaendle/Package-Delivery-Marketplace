/*global google*/
import React, { Component } from 'react';
import Navigation from '../components/Navigation';
import Header from "../components/Header";
import '../App.css';
import { withAuthentication } from "../Session";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
require('dotenv').config();

export class Package extends Component {

    constructor() {
        super();

        this.state = {
            startLocation: {
                lon: null,
                lat: null
            },
            destination: {
                lon: null,
                lat: null
            }, 
            googleAPIKey: process.env.REACT_APP_GOOLE_API_KEY
        }
        this.handleMapClick = this.handleMapClick.bind(this);
    }

    handleMapClick(e) {
        if(e.latLng != null){
            let lat = e.latLng.lat();
            let lon = e.latLng.lng();
            
            if(this.state.startLocation.lon == null && this.state.startLocation.lat == null){
                this.setState({
                    startLocation: {
                        lat: lat,
                        lon: lon
                    }
                })
            } else if(this.state.startLocation != null && (this.state.destination.lon == null && this.state.destination.lat == null)){
                this.setState({
                    destination: {
                        lat: lat,
                        lon: lon
                    }
                }) 
            }else {
                alert("Values are already set. Please clear to set them again.")
            }
        }
    }

    clearValues() {
        this.setState({
            startLocation: {
                lon: null,
                lat: null
            },
            destination: {
                lon: null,
                lat: null
            }
        })
    }

    render() {

        const GoogleMapComponent = withScriptjs(withGoogleMap((props) =>
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: -34.397, lng: 150.644 }}
            onClick={this.handleMapClick}
        >
            {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
        </GoogleMap>
        ))

        let googleMapURL = "https://maps.googleapis.com/maps/api/js?libraries=places&key=" + this.state.googleAPIKey;

        return (
            <div className="App">
                <Header />
                <Navigation/>
                <div className="main-content">
                    <h3>
                        Insert a new package to the marketplace
                    </h3>
                    <div>
                        <p>
                            <span>What's the size of your package?</span>
                            <select>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </p>
                        <p>
                            <span>
                                How heavy is it?
                            </span>
                            <select>
                                <option value="light">Light</option>
                                <option value="medium">Medium</option>
                                <option value="heavy">Heavy</option>
                            </select>
                        </p>
                        <p>
                            <span>
                                What priority should it have?
                                <input type="range" id="start" name="priority"
                                        min="0" max="10"/>
                                <label htmlFor="priority">Priority</label>
                            </span>
                        </p>
                        <p>
                            <span>Any Comments?</span>
                            <textarea></textarea>
                        </p>
                        <GoogleMapComponent
                            isMarkerShown
                            googleMapURL= {googleMapURL}
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `400px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                        />
                        <button onClick={this.clearValues}>Clear Values</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuthentication(Package);
