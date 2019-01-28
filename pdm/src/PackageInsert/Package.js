/*global google*/

import React, { Component } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation';
import Header from "../components/Header";
import '../App.css';
import { withAuthentication } from "../Session";
import Script from 'react-load-script';
require('dotenv').config();

export class Package extends Component {

    constructor() {
        super();
        this.state = {
            startLocation: {
                lat: null,
                lng: null
            },
            destination: {
                lat: null,
                lng: null
            }, 
            googleAPIKey: process.env.REACT_APP_GOOLE_API_KEY,
            currentLatLng: {
                lat:  48.735281,
                lng: 9.181969
            },
            showSecondMarker: false,
            priority: "",
            price: "",
            map: null,
            directionsService: null,
            directionsDisplay: null,
            place: null,
            mapPositionArray: []
        }
        this.handleMapClick = this.handleMapClick.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.continueToFinalPage = this.continueToFinalPage.bind(this);
        this.initAutocomplete = this.initAutocomplete.bind(this);
        this.initMap = this.initMap.bind(this);

        //Create refs
        this.rangeRef = React.createRef();
        this.sizeRef = React.createRef();
        this.weightRef = React.createRef();
        this.commentRef = React.createRef();
        this.priceRef = React.createRef();
        
    }

    componentWillMount() {
        //this.getGeoLocation();
    }

    componentDidMount() {
        this.setState({
            priority: "Priority: Very High",
            price: "Price: " + this.priceRef.current.value + "€"
        })
    }

    handleMapClick(e) {
        if(e.latLng != null){
            let locations = document.getElementById("selected-locations");
            locations.style.opacity = 1;
            locations.style.transform = 'scale(1)';
            let lat = e.latLng.lat();
            let lon = e.latLng.lng();
            
            if(this.state.startLocation.lon == null && this.state.startLocation.lat == null){
                this.setState({
                    startLocation: {
                        lat: lat,
                        lng: lon
                    }
                })
            } else if(this.state.startLocation != null && (this.state.destination.lon == null && this.state.destination.lat == null)){
                this.setState({
                    destination: {
                        lat: lat,
                        lng: lon
                    },
                    showSecondMarker: true
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
                    this.setState({
                        currentLatLng: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        startLocation: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    }
                    )}
            )
        } else {
           console.log("Failed fetching current GPS coordinates.");
        }
    }

    initMap() {
        var geocoder = new google.maps.Geocoder();

        /*if(this.state.currentLatLng.lat === 0){
            this.getGeoLocation();
            console.log(this.state)
        }*/
        console.log(this.state)
        //Create the map component
        let map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 48.735281, lng: 9.181969}, 
            zoom: 10
        });

        // Add Event listener to map
        // Create new Info Window and Marker for each clicked location
        google.maps.event.addListener(map, 'click', function(event) {
            this.addInfoWindowForLocation(event, geocoder);
            
        }.bind(this));

        this.setState({
            map: map,
            directionsService: new google.maps.DirectionsService(),
            directionsDisplay: new google.maps.DirectionsRenderer({
                map: map
            })
        })

        this.createNewInfoWindow(
            this.state.currentLatLng.lat,
            this.state.currentLatLng.lng,
            geocoder
        )

        this.initAutocomplete(geocoder)
    }

    /**
     * Initialize Autocomplete input
     */
    initAutocomplete(geocoder){
        if(this.state.map){
            let input = document.getElementById('searchTextField');
            let marker =  new google.maps.Marker({
                map: this.state.map
            })
    
            let autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', this.state.map);
    
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                this.place = autocomplete.getPlace();
    
                var newlatlong = new google.maps.LatLng(this.place.geometry.location.lat(), this.place.geometry.location.lng());
                this.state.map.setCenter(newlatlong);
    
                this.checkIfInfoWindowIsReached();
                this.createNewInfoWindow(
                    this.place.geometry.location.lat(),
                    this.place.geometry.location.lng(),
                    geocoder
                )
                
                marker.setPosition(newlatlong);
                this.state.map.setZoom(12);
            }.bind(this));
        }
    }

    /**
     * Adds an Info Window when clicked on the map with the named address
     */
    addInfoWindowForLocation(event, geocoder) {
        var infoWindow;
        var marker;

        //Check, whether an Info Window already exists for the current location
        for(let i =0; i<this.state.mapPositionArray.length; i++){
            if(this.state.mapPositionArray[i].lat === event.latLng.lat() && this.state.mapPositionArray[i].lon === event.latLng.lng()){
                infoWindow = this.state.mapPositionArray[i].infoWindow;
                marker = this.state.mapPositionArray[i].marker;
            }
            if(this.state.mapPositionArray[i].infoWindow){
                this.state.mapPositionArray[i].infoWindow.close();
            }
        }

        this.checkIfInfoWindowIsReached();

        // If no Info Window exists yet, create a one
        if(!infoWindow){
            this.createNewInfoWindow(
                event.latLng.lat(),
                event.latLng.lng(),
                geocoder
            )
        }
    }

    checkIfInfoWindowIsReached() {
        if(this.state.mapPositionArray.length > 1) {

            for(let i =0; i<this.state.mapPositionArray.length; i++){
                this.state.mapPositionArray[i].marker.setMap(null);
            }
            this.setState({
                mapPositionArray: []
            })
        }
    }

    createNewInfoWindow(lat, lng, geocoder) {
        console.log("here")
        let infoWindow, marker;
        var latlng = {lat: lat, lng: lng};
            let mapPosition = {
                lat:lat,
                lon: lng,
                infoWindow: new google.maps.InfoWindow,
                marker: new google.maps.Marker({
                    position: latlng,
                    map: this.state.map
                })
            }

            let newMapPositions = this.state.mapPositionArray;
            newMapPositions.push(mapPosition);
            this.setState({
                mapPositionArray: newMapPositions
            })
            infoWindow = mapPosition.infoWindow;
            marker = mapPosition.marker;

            // Get address from coordinates
            let coordinates = {
                lat: lat,
                lon:  lng
            }
            this.geocodeLatLng(geocoder, this.state.map, infoWindow, coordinates, marker);
    }

    /*
        Get address from coordinates
    */
    geocodeLatLng(geocoder, map, infowindow, coordinates, marker) {
        var latlng = {lat: coordinates.lat, lng: coordinates.lon};
        geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                marker.addListener("click", function(){
                    infowindow.open(map, marker);
                })

                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);
            } else {
            window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
        });
    }

    clearValues() {
        this.setState({
            startLocation: {
                lat: null,
                lng: null
            },
            destination: {
                lat: null,
                lng: null
            }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.destination.lng != null && this.state.startLocation.lng != null){
            const size = this.sizeRef.current.value;
            const weight = this.weightRef.current.value;
            const priority = this.rangeRef.current.value;
            const comment = this.commentRef.current.value;
            const price = this.priceRef.current.value;
            let res;
    
    
            axios.post('https://us-central1-studienarbeit.cloudfunctions.net/parcel', {
                size,
                weight,
                priority,
                comment,
                price,
                startLocation: this.state.startLocation,
                destination: this.state.destination
            })
            .then(response => { 
                res = response;
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

            this.continueToFinalPage(currentPackage, res);
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
        let value ="";
        switch (this.rangeRef.current.value) {
            case "1":
                value = "Very low"
                break;
            case "2":
                value = "Low"
                break;
            case "3":
                value = "Normal"
                break;
            case "4":
                value = "High"
                break;
            case "5":
                value = "Very High"
                break;
            default:
                value= ""
                break;
        }
        this.setState({
            priority: "Priority: " +value 
        })
    }

    updatePriceLabel(e) {
        e.preventDefault();
        this.setState({
            price: "Price: " + this.priceRef.current.value + "€"
        })
    }

    continueToFinalPage(currentPackage, res) {
        this.props.history.push({
            pathname: '/final',
            state: { 
                userType: "customer",
                package: currentPackage,
                response: res
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
                        <input type="text" id="searchTextField"/>
                        <div id="map"></div>   
                        <form onSubmit={this.handleSubmit}>
                            <p  className="p-border">
                                <span style={{fontWeight: 600}}>What's the size of your package?</span>
                                <select name="size" ref={this.sizeRef} className="package-insert-select">
                                    <option value="small">S (35 x 25 x 10 cm)</option>
                                    <option value="medium">M (60 x 30 x 15 cm)</option>
                                    <option value="large">L (120 x 60 x 60 cm)</option>
                                </select>
                            </p>
                            <p className="p-border">
                                <span style={{fontWeight: 600}}>
                                    How heavy is it?
                                </span>
                                <select name="weight" ref={this.weightRef} className="package-insert-select">
                                    <option value="light">Up to 2 Kg</option>
                                    <option value="medium">Up to 5 Kg</option>
                                    <option value="heavy">Up to 10 Kg</option>
                                </select>
                            </p>
                            <div style={{marginTop: "10px"}}>
                                <p className="p-border">
                               <span  style={{fontWeight: 600}}>
                               What priority should it have?
                                </span>  <br/><br/>
                                    <span style={{marginRight: "20px", display: "inline-block", width: "135px"}}>
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
                                <span style={{marginRight: "20px", display: "inline-block", width: "135px"}}>
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
                            <div id="selected-locations">
                                <div className="speech-bubble">
                                </div>
                                <div style={{lineHeight: "19px"}}>
                                    <span style={{fontWeight: 600}}>Start Location</span> <br/>
                                    {this.state.startLocation.lat ? this.state.startLocation.lat.toFixed(3) : "0"}, {" "} 
                                    {this.state.startLocation.lng ? this.state.startLocation.lng.toFixed(3) : "0"}
                                </div>
                                    <br/>
                                <div style={{lineHeight: "19px"}}>
                                    <span style={{fontWeight: 600}}> Destination </span> <br/>
                                    {this.state.destination.lat ? this.state.destination.lat.toFixed(3) : "0"},  {" "}
                                    {this.state.destination.lng ? this.state.destination.lng.toFixed(3) : "0"}
                                </div>
                            </div>    
                            <div style={{marginTop: "20px"}}>
                                <button className="buttons critical-button" onMouseDown={this.clearValues}>Clear Values</button>
                                <input className="buttons cta-button" type="submit" style={{float: "right"}} value="Submit"/>
                            </div>
                        </form>
                    </div>
                </div>
                <Script url={googleMapURL} onLoad={this.initMap}/>
            </div>
        );
    }
}

export default withAuthentication(Package);
