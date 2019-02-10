/*global google*/

import React, { Component } from 'react';
import '../App.css';
import { withAuthentication } from "../Session";
import Script from 'react-load-script';
require('dotenv').config();

export class Maps extends Component {

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
                lat:  null,
                lng: null
            },
            directionsService: null,
            directionsDisplay: null,
            place: null,
            mapPositionArray: [],
            allowMultipleClicks: true,
            showAutoCompleteBar: true
        }
       
        this.initAutocomplete = this.initAutocomplete.bind(this);
        this.initMap = this.initMap.bind(this);
        this.setGeoLocation = this.setGeoLocation.bind(this);


        let map, geocoder, formatted_address = null, address;
        let coordinates = {
            lat: 10,
            lng: 10
        }
        
    }

    componentWillMount() {
        this.getGeoLocation();
        if(this.props.allowMultipleClicks === "false"){
            this.setState({
                allowMultipleClicks: false
            })
        }
        if(this.props.showAutoCompleteBar === "false"){
            this.setState({
                showAutoCompleteBar: false
            })
        }
    }

    handleScriptCreate() {
        this.getGeoLocation();
    }


    getGeoLocation() {
        if (navigator.geolocation) {
            (navigator.geolocation.getCurrentPosition(this.setGeoLocation))
        } else {
           console.log("Failed fetching current GPS coordinates.");
        }
    }

    setGeoLocation(position) {
        this.coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: ""
        }

        console.log(this.coordinates)
        if(this.props.callbackFromDriver){
            this.props.callbackFromDriver(this.coordinates)
        }else if (this.props.callbackFromParent){
            this.props.callbackFromParent(this.coordinates)
        }
    }

    initMap() {
        setTimeout(
            function() {
                this.geocoder = new google.maps.Geocoder();

                //Create the map component
                this.map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: this.coordinates.lat, lng: this.coordinates.lng}, 
                    zoom: 10
                })

                // Add Event listener to map
                // Create new Info Window and Marker for each clicked location
                google.maps.event.addListener(this.map, 'click', function(event) {
                    if(this.state.allowMultipleClicks){
                        this.addInfoWindowForLocation(event, this.geocoder);
                    }
                }.bind(this));

                this.setState({
                    directionsService: new google.maps.DirectionsService(),
                    directionsDisplay: new google.maps.DirectionsRenderer({
                        map: this.map
                    })
                })

                //Create marker for the current location
                this.createNewInfoWindow(
                    this.coordinates.lat,
                    this.coordinates.lng,
                    this.geocoder
                )

                //Initialize the autocomplete text field
                if(this.state.showAutoCompleteBar){
                    this.initAutocomplete(this.geocoder)
                }
            }
            .bind(this),
            160
        );

        
    }

    /**
     * Initialize Autocomplete input
     */
    initAutocomplete(geocoder){
        if(this.map){
            let input = document.getElementById('searchTextField');
            let marker =  new google.maps.Marker({
                map: this.map
            })
    
            let autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', this.map);
    
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                this.place = autocomplete.getPlace();
    
                var newlatlong = new google.maps.LatLng(this.place.geometry.location.lat(), this.place.geometry.location.lng());
                this.map.setCenter(newlatlong);
    
                this.checkIfInfoWindowIsReached();
                this.createNewInfoWindow(
                    this.place.geometry.location.lat(),
                    this.place.geometry.location.lng(),
                    geocoder
                )
                
                marker.setPosition(newlatlong);
                this.map.setZoom(12);
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

        this.props.callbackFromParent(this.state.mapPositionArray)
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
        let infoWindow, marker;
        var latlng = {lat: lat, lng: lng};
        let mapPosition = {
            lat:lat,
            lon: lng,
            infoWindow: new google.maps.InfoWindow(),
            marker: new google.maps.Marker({
                position: latlng,
                map: this.map
            })
        }

        let newMapPositions = this.state.mapPositionArray;
        newMapPositions.push(mapPosition);
        this.setState({
            mapPositionArray: newMapPositions
        })
        infoWindow = mapPosition.infoWindow;
        marker = mapPosition.marker;

        this.geocodeLatLng(geocoder, this.map, infoWindow, latlng, marker);
    }

    /*
        Get address from coordinates
    */
    geocodeLatLng(geocoder, map, infowindow, coordinates, marker) {
        var latlng = {lat: coordinates.lat, lng: coordinates.lng};
        geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                marker.addListener("click", function(){
                    infowindow.open(map, marker);
                })

                this.formatted_address = results[0].formatted_address;
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);
            } else {
                window.alert('No results found');
            }
            } 
            else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

    /*
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
    }*/


    render() {

        let googleMapURL = "https://maps.googleapis.com/maps/api/js?libraries=places&key=" + this.state.googleAPIKey;

        return (
            <div>
                <Script url={googleMapURL}    onCreate={this.handleScriptCreate.bind(this)} onLoad={this.initMap}/>   
                { this.state.showAutoCompleteBar ? <input type="text" id="searchTextField"/> : ""}
                <div id="map"></div>   
            </div>
        );
    }
}

export default withAuthentication(Maps);
