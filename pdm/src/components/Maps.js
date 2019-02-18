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
                lat: null,
                lng: null
            },
            directionsService: null,
            directionsDisplay: null,
            place: null,
            mapPositionArray: [],
            allowMultipleClicks: true,
            allowSingleClicks: true,
            showAutoCompleteBar: true,
            duration: "",
            distance: "",
            scriptLoaded: false,
            numberOfClicksAllowed: 2,
            coordinates: {
                lat: 48.7823200,
                lng: 9.1770200
            }
        }

        this.initAutocomplete = this.initAutocomplete.bind(this);
        this.initMap = this.initMap.bind(this);
        this.calculateAndDisplayRoute = this.calculateAndDisplayRoute.bind(this);

        let map, geocoder;
    }

    componentWillMount() {
        //this.getGeoLocation();
        if (this.props.numberOfClicksAllowed) {
            this.setState({
                numberOfClicksAllowed: parseInt(this.props.numberOfClicksAllowed, 10)
            })
        }
        if (this.props.showAutoCompleteBar === "false") {
            this.setState({
                showAutoCompleteBar: false
            })
        }

        if (this.props.startLocation) {
            this.setState({
                startLocation: this.props.startLocation,
                destination: this.props.destination
            })
        }
    }


    componentDidMount() {
        console.log(this.state)
        if (this.props.calculateRoute === "true") {
            setTimeout(
                function () {
                    this.calculateAndDisplayRoute();
                }.bind(this), 250
            )
        }
    }

    /*
    getGeoLocation() {
        navigator.geolocation.watchPosition(function (position) {
            console.log("Position detection allowed.");
            (navigator.geolocation.getCurrentPosition(this.setGeoLocation))
        }.bind(this),
            function (error) {
                if (error.code === error.PERMISSION_DENIED){
                    console.log("Position decetion denied");
                    this.setState({
                        coordinates: {
                            lat: 48.7823200,
                            lng: 9.1770200
                        }
                    })
                }
            }.bind(this));

        if (this.props.callbackFromDriver) {
            this.props.callbackFromDriver(this.state.coordinates)
        } else if (this.props.callbackFromParent) {
            this.props.callbackFromParent(this.state.coordinates)
        }
    }

    setGeoLocation(position) {
        this.setState({
            coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        });
        this.map.setCenter({lat:this.state.coordinates.lat,lng:this.state.coordinates.lng})
        

        //Create marker for the current location
        /*if (!this.props.calculateRoute) {
            this.createNewInfoWindow(
                this.state.coordinates.lat,
                this.state.coordinates.lng,
                this.geocoder
            )
        }*/
    //}

    initMap() {
        
        this.geocoder = new google.maps.Geocoder();

        //this.getGeoLocation();
        //Create the map component
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { 
                lat: this.state.coordinates.lat,
                lng: this.state.coordinates.lng },
            zoom: 10
        })

        // Add Event listener to map
        // Create new Info Window and Marker for each clicked location
        google.maps.event.addListener(this.map, 'click', function (event) {
            if (this.state.numberOfClicksAllowed > 0) {
                this.addInfoWindowForLocation(event, this.geocoder);
            }
        }.bind(this));

        this.setState({
            directionsService: new google.maps.DirectionsService(),
            directionsDisplay: new google.maps.DirectionsRenderer({
                map: this.map
            })
        })

        //Initialize the autocomplete text field
        if (this.state.showAutoCompleteBar) {
            this.initAutocomplete(this.geocoder)
        }

    }

    calculateAndDisplayRoute() {
        if (this.state.directionsService && this.state.directionsDisplay) {
            this.state.directionsDisplay.setMap(null);
            this.state.directionsDisplay.setMap(this.map);

            this.state.directionsService.route({
                origin: this.state.startLocation,
                destination: this.state.destination,
                waypoints: [{
                    location: {
                        lat: 48.770725, 
                        lng: 9.165130
                    },
                    stopover: true
                }],
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true
            }, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.state.directionsDisplay.setDirections(response);
                    //let durLabel = document.getElementById("duration-label");
                    //let disLabel = document.getElementById("distance-label");


                    let totalDuration = 0;
                    let totalDistance = 0;

                    let dirRoutes = this.state.directionsDisplay.directions;
                    for (let i = 0; i < dirRoutes.routes[0].legs.length; i++) {
                        totalDistance += dirRoutes.routes[0].legs[i].distance.value;
                        totalDuration += dirRoutes.routes[0].legs[i].duration.value;
                    }

                    let roundedTotalDistance = (totalDistance / 1000);
                    roundedTotalDistance = roundedTotalDistance.toFixed(1);

                    var date = new Date(null);
                    date.setSeconds(totalDuration); // specify value for SECONDS here
                    var resultTime = 0;
                    if (totalDuration < 3600) {
                        resultTime = date.toISOString().substr(14, 5);
                    } else {
                        resultTime = date.toISOString().substr(11, 8);
                    }

                    this.setState({
                        duration: resultTime,
                        distance: roundedTotalDistance + " km"
                    })
                    //durLabel.innerHTML = "Duration: " + resultTime;
                    //disLabel.innerHTML = "Distance: " + roundedTotalDistance + " km";
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            }.bind(this));
        }
    }

    /**
     * Initialize Autocomplete input
     */
    initAutocomplete(geocoder) {
        if (this.map) {
            let input = document.getElementById('searchTextField');
            let marker = new google.maps.Marker({
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

                if (this.props.callbackFromDriver) {
                    this.props.callbackFromDriver(
                        {
                            lat: this.place.geometry.location.lat(),
                            lng: this.place.geometry.location.lng()
                        }
                    )
                } else if (this.props.callbackFromParent) {
                    this.props.callbackFromParent(this.state.coordinates)
                }

                this.map.setZoom(11);
            }.bind(this));
        }
    }

    /**
     * Adds an Info Window when clicked on the map with the named address
     */
    addInfoWindowForLocation(event, geocoder) {
        var infoWindow;

        //Check, whether an Info Window already exists for the current location
        for (let i = 0; i < this.state.mapPositionArray.length; i++) {
            if (this.state.mapPositionArray[i].lat === event.latLng.lat() && this.state.mapPositionArray[i].lon === event.latLng.lng()) {
                infoWindow = this.state.mapPositionArray[i].infoWindow;
            }
            if (this.state.mapPositionArray[i].infoWindow) {
                this.state.mapPositionArray[i].infoWindow.close();
            }
        }

        this.checkIfInfoWindowIsReached();

        // If no Info Window exists yet, create a one
        if (!infoWindow) {
            this.createNewInfoWindow(
                event.latLng.lat(),
                event.latLng.lng(),
                geocoder
            )
        }

        if(this.props.callbackFromParent){
            this.props.callbackFromParent(this.state.mapPositionArray)
        }else if(this.props.callbackFromDriver){
            this.props.callbackFromDriver(
                {
                    lat:  event.latLng.lat(),
                    lng:  event.latLng.lng()
                }
            )
        }
    }

    checkIfInfoWindowIsReached() {
        if (this.state.mapPositionArray.length > this.state.numberOfClicksAllowed -1 ) {
            for (let i = 0; i < this.state.mapPositionArray.length; i++) {
                this.state.mapPositionArray[i].marker.setMap(null);
            }
            this.setState({
                mapPositionArray: []
            })
        }
    }

    createNewInfoWindow(lat, lng, geocoder) {
        let infoWindow, marker;
        var latlng = { lat: lat, lng: lng };
        let mapPosition = {
            lat: lat,
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
        var latlng = { lat: coordinates.lat, lng: coordinates.lng };
        geocoder.geocode({ 'location': latlng }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    marker.addListener("click", function () {
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
                {this.state.showAutoCompleteBar ? <input type="text" id="searchTextField" /> : ""}
                <div id="map"></div>
                <div>
                    {this.props.calculateRoute ?
                        <div>
                            <p ref={this.distanceLabel}>
                                Distance: {this.state.distance}
                            </p>
                            <p ref={this.durationLabel}>
                                Duration: {this.state.duration}
                            </p>
                        </div> : ""}
                </div>
                <Script url={googleMapURL} onLoad={this.initMap.bind(this)} />
            </div>
        );
    }
}

export default withAuthentication(Maps);
