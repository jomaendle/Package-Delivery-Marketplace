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
            },
            time: 0
        }

        this.rangeRef = React.createRef();
    }

    componentDidMount() {
        this.setState({
            time: "Hours: " + this.rangeRef.current.value
        })
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

    updateTimeLabel(e) {
        e.preventDefault();
        this.setState({
            time: "Hours: " + this.rangeRef.current.value
        })
    }

    handleSubmit = (e) => {
        this.props.history.push({
            pathname: '/driver-select-packages',
            state: { 
                currentLatLng: this.state.currentLatLng,
                timeAvailable: this.state.time}
          })
    }   

    render() {

        let googleMapURL = "https://maps.googleapis.com/maps/api/js?libraries=places&key=" + this.state.googleAPIKey;
        const { currentLatLng } = this.state;
        return (

            <div className="App">
                <Header />
                <Navigation currentPage="delivery" />
                <div className="main-content">
                    <h2>
                        Want to deliver packages? 
                    </h2>
                   
                    <div>
                        <div>
                            <p className="p-border">
                            <span style={{fontWeight: 600}}>How much time do you have for delivering?</span><br/><br/>
                                <span style={{marginRight: "15px"}}>
                                    {this.state.time}
                                </span>
                                <input type="range" ref={this.rangeRef} name="priority"
                                                min="1" max="5" style={{ width: "250px", marginTop: "15px"}}
                                            onChange={(e) => {this.updateTimeLabel(e)}}
                                />

                            </p>
                        </div>

                        <span style={{marginBottom: "15px", marginTop: "40px", display: "block", fontWeight: 600}}>Your current location</span>
                        <GoogleMapComponent
                            isMarkerShown={true}
                            center={currentLatLng}
                            currentLatLng={this.state.currentLatLng}
                            googleMapURL= {googleMapURL}
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `400px` }} />}
                            mapElement={<div style={{ height: `100%`, borderRadius: "8px", boxShadow: "0 2px 10px #8e8e8ecc" }}
                             />}
                        />
                        <div style={{marginTop: "20px"}}>
                            <button className="buttons cta-button" onMouseDown={this.handleSubmit} style={{float: "right"}}>Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuthentication(Driver);
