import React, { Component } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation';
import Header from "../components/Header";
import '../App.css';
import { withAuthentication } from "../Session";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
require('dotenv').config();

const GoogleMapComponent = withScriptjs(withGoogleMap((props) =>
<GoogleMap
    defaultZoom={11}
    defaultCenter={props.currentLatLng}
    onClick={props.handleMapClick}
>
    {props.isMarkerShown && <Marker position={props.currentLatLng} />}
</GoogleMap>
))

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
            currentLatLng: {
                lat: 0,
                lng: 0
            },
            priority: "",
            price: ""
        }
        this.handleMapClick = this.handleMapClick.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.continueToFinalPage = this.continueToFinalPage.bind(this);

        //Create refs
        this.rangeRef = React.createRef();
        this.sizeRef = React.createRef();
        this.weightRef = React.createRef();
        this.commentRef = React.createRef();
        this.priceRef = React.createRef();
    }

    componentWillMount() {
        this.getGeoLocation();
        
    }

    componentDidMount() {
        this.setState({
            priority: "Priority: " + this.rangeRef.current.value,
            price: "Price: " + this.priceRef.current.value + "€"
        })
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

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.destination.lon || this.state.startLocation.lon){
            
            const size = this.sizeRef.current.value;
            const weight = this.weightRef.current.value;
            const priority = this.rangeRef.current.value;
            const comment = this.commentRef.current.value;
            const price = this.priceRef.current.value;
    
    
            axios.post('http://localhost:8080/', {
                size,
                weight,
                priority,
                comment,
                price,
                startLocation: this.state.startLocation,
                destination: this.state.destination
            })
            .then(response => { 
                console.log(response)
            })
            .catch(error => {
                console.log(error.response)
            });

            let currentPackage = {
                size,
                weight,
                priority,
                comment,
                price
            }

            this.continueToFinalPage(currentPackage);
        }else{
            alert("Please select the start and final destination of the package. ")
        }
    }

    redirectToCompletePage(){
        this.props.history.push({
            pathname: '/driver',
            state: { 
                currentLatLng: this.state.currentLatLng
            }
        })
    }

    updatePriorityLabel(e) {
        e.preventDefault();
        this.setState({
            priority: "Priority: " + this.rangeRef.current.value 
        })
    }

    updatePriceLabel(e) {
        e.preventDefault();
        this.setState({
            price: "Price: " + this.priceRef.current.value + "€"
        })
    }

    continueToFinalPage(obj) {
        this.props.history.push({
            pathname: '/final',
            state: { 
                userType: "customer",
                package: obj
            }
        })
    }

    render() {

        let googleMapURL = "https://maps.googleapis.com/maps/api/js?libraries=places&key=" + this.state.googleAPIKey;

        return (
            <div className="App">
                <Header />
                <Navigation currentPage="package"/>
                <div className="main-content">
                    <h2>
                        Insert a new package to the marketplace
                    </h2>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <p  className="p-border">
                                <span style={{fontWeight: 600}}>What's the size of your package?</span>
                                <select name="size" ref={this.sizeRef} className="package-insert-select">
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </p>
                            <p className="p-border">
                                <span style={{fontWeight: 600}}>
                                    How heavy is it?
                                </span>
                                <select name="weight" ref={this.weightRef} className="package-insert-select">
                                    <option value="light">Light</option>
                                    <option value="medium">Medium</option>
                                    <option value="heavy">Heavy</option>
                                </select>
                            </p>
                            <div style={{marginTop: "10px"}}>
                                <p className="p-border">
                               <span  style={{fontWeight: 600}}>
                               What priority should it have?
                                </span>  <br/><br/>
                                    <span style={{marginRight: "20px"}}>
                                        {this.state.priority}
                                    </span>
                                    <input type="range" ref={this.rangeRef} name="priority"
                                            min="1" max="5" style={{ width: "250px"}}
                                            onChange={(e) => {this.updatePriorityLabel(e)}}
                                    />
                                    
                            </p>
                            <p className="p-border">
                                <span style={{fontWeight: 600}}>
                                    Whats your maximum price?
                                </span> <br/><br/>
                                <span style={{marginRight: "15px"}}>
                                        {this.state.price}
                                    </span>
                                    <input type="range" ref={this.priceRef} name="price"
                                            min="1" max="100" style={{ width: "250px"}}
                                            onChange={(e) => {this.updatePriceLabel(e)}}
                                    />
                            </p>
                        </div>
                            <p className="p-border">
                                <span style={{fontWeight: 600}}>Any Comments?</span>
                                <textarea id="package-comment" name="comment" 
                                className="package-insert-select"
                                ref={this.commentRef}
                                ></textarea>
                            </p>
                            <GoogleMapComponent
                                isMarkerShown
                                handleMapClick={this.handleMapClick}
                                googleMapURL= {googleMapURL}
                                currentLatLng = {this.state.currentLatLng}
                                loadingElement={<div style={{ height: `100%` }} />}
                                containerElement={<div style={{ height: `400px` }} />}
                                mapElement={<div style={{ height: `100%`, borderRadius: "8px", boxShadow: "0 2px 10px #8e8e8ecc" }} />}
                            />
                            <div style={{marginTop: "20px"}}>
                                <button className="buttons critical-button" onMouseDown={this.clearValues}>Clear Values</button>
                                <input className="buttons cta-button" type="submit" style={{float: "right"}} value="Submit"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuthentication(Package);
