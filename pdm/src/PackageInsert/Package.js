import React, { Component } from 'react';
import axios from 'axios';
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
            googleAPIKey: process.env.REACT_APP_GOOLE_API_KEY,
            
        }
        this.handleMapClick = this.handleMapClick.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        //Create refs
        this.rangeRef = React.createRef();
        this.sizeRef = React.createRef();
        this.weightRef = React.createRef();
        this.commentRef = React.createRef();
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

    componentDidMount() {
        axios.get(`https://jsonplaceholder.typicode.com/users`)
          .then(res => {
            const persons = res.data;
            this.setState({ persons });
          })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        
        const size = this.sizeRef.current.value;
        const weight = this.weightRef.current.value;
        const priority = this.rangeRef.current.value;
        const comment = this.commentRef.current.value;

        axios.post('/', { size, weight, priority, comment })
        .then((result) => {
          //access the results here....
            console.log("res: "+result );
        });
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
                        <form onSubmit={this.handleSubmit}>
                            <p>
                                <span>What's the size of your package?</span>
                                <select name="size" ref={this.sizeRef} className="package-insert-select">
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </p>
                            <p>
                                <span>
                                    How heavy is it?
                                </span>
                                <select name="weight" ref={this.weightRef} className="package-insert-select">
                                    <option value="light">Light</option>
                                    <option value="medium">Medium</option>
                                    <option value="heavy">Heavy</option>
                                </select>
                            </p>
                            <div style={{marginTop: "10px"}}>
                                <span>
                                    What priority should it have?
                                    <p>
                                        <input type="range" ref={this.rangeRef} name="priority"
                                                min="1" max="5" style={{ width: "250px"}}
                                               //onChange={(e) => {this.updatePriorityLabel(e)}}
                                        />
                                    </p>

                                </span>
                            </div>
                            <p>
                                <span>Any Comments?</span>
                                <textarea id="package-comment" name="comment" 
                                className="package-insert-select"
                                ref={this.commentRef}
                                ></textarea>
                            </p>
                            <GoogleMapComponent
                                isMarkerShown
                                googleMapURL= {googleMapURL}
                                loadingElement={<div style={{ height: `100%` }} />}
                                containerElement={<div style={{ height: `400px` }} />}
                                mapElement={<div style={{ height: `100%` }} />}
                            />
                            <div style={{marginTop: "20px"}}>
                                <button className="buttons" onClick={this.clearValues}>Clear Values</button>
                                <input className="buttons" type="submit" value="Submit"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuthentication(Package);
