import React, { Component } from 'react';
import Navigation from '../components/Navigation';
import Header from "../components/Header";
import '../App.css';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { withAuthentication } from "../Session";
require('dotenv').config();

const GoogleMapComponent = withScriptjs(withGoogleMap((props) =>
<GoogleMap
    defaultZoom={11}
    defaultCenter={ props.currentLatLng }
    ref={props.ref}
>
    {props.isMarkerShown && <Marker position={props.currentLatLng} />}
</GoogleMap>
))

export class Driver extends Component {

    constructor() {
        super();
        
        this.state = {
            googleAPIKey: process.env.REACT_APP_GOOLE_API_KEY,
            currentLatLng: {
                lat: 0,
                lng: 0
            }
        }
    }
    

    componentWillMount(){
        this.getGeoLocation();
    }

    getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.setState(prevState => ({
                        currentLatLng: {
                            ...prevState.currentLatLng,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    }))
                }
            )
        } else {
           console.log("Failed fetching current GPS coordinates.");
        }
    }

    handleSubmit = (e) => {
        this.props.history.push({
            pathname: '/driver-select-packages',
            state: { 
                currentLatLng: this.state.currentLatLng,
                timeAvailable: 5}
          })
    }   

    render() {

        let googleMapURL = "https://maps.googleapis.com/maps/api/js?libraries=places&key=" + this.state.googleAPIKey;
        const { currentLatLng } = this.state;
        return (
            

            <div className="App">
                <Header />
                <Navigation/>
                <div className="main-content">
                    <h3>
                        Want to deliver packages? 
                    </h3>
                    <h4>
                    First, select your capacity to continue. <br/>
                    After, you can view current packages that need to be deliverd.
                    </h4>
                   
                    <div>
                        <div>
                            <p className="p-border">
                            <span>How much time do you have for delivering?</span>
                                <input type="range" ref={this.rangeRef} name="priority"
                                                min="1" max="5" style={{ width: "250px", display: "block", marginTop: "15px"}}
                                            //onChange={(e) => {this.updatePriorityLabel(e)}}
                                />
                            </p>
                        </div>

                        <span style={{marginBottom: "15px", marginTop: "40px", display: "block"}}>Your current location:</span>
                        <GoogleMapComponent
                            isMarkerShown={true}
                            center={currentLatLng}
                            currentLatLng={this.state.currentLatLng}
                            googleMapURL= {googleMapURL}
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `400px` }} />}
                            mapElement={<div style={{ height: `100%`, borderRadius: "3px" }}
                             />}
                        />
                        <div style={{marginTop: "20px"}}>
                            <button className="buttons" onClick={this.handleSubmit} style={{float: "right"}}>Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuthentication(Driver);
