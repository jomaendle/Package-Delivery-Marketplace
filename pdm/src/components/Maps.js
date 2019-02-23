/*global google*/

import React, { Component } from "react";
import "../App.css";
import { withAuthentication } from "../Session";
import Script from "react-load-script";
require("dotenv").config();

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
      waypoints: [],
      numberOfClicksAllowed: 2,
      coordinates: {
        lat: 48.78232,
        lng: 9.17702
      },
      openPackages: [],
      pickedUpPackages: [],
      pickedUpClicked: false,
      currentPackageState: ""
    };

    this.initAutocomplete = this.initAutocomplete.bind(this);
    this.initMap = this.initMap.bind(this);
    this.calculateAndDisplayRoute = this.calculateAndDisplayRoute.bind(this);
    
    let map, geocoder, lastDestination;
  }

  componentWillMount() {
    //this.getGeoLocation();
    var PromiseWorker = require('promise-worker');
    var worker = new Worker('./worker.js');
    let promiseWorker = new PromiseWorker(worker);


    if (this.props.numberOfClicksAllowed) {
      this.setState({
        numberOfClicksAllowed: parseInt(this.props.numberOfClicksAllowed, 10)
      });
    }
    if (this.props.showAutoCompleteBar === "false") {
      this.setState({
        showAutoCompleteBar: false
      });
    }

    if (this.props.startLocation) {
      this.setState({
        startLocation: this.props.startLocation,
        destination: this.props.destination
      });
    }
    if (this.props.waypoints) {
      this.setState({
        waypointsDetails: this.props.waypoints
      });
      
      for (let i = 0; i < this.props.waypoints.length; i++) {
        this.state.waypoints.push({
          location: this.props.waypoints[i].coords,
          stopover: true
        });
      }
    }
    this.setState({
      pickedUpClicked: this.props.pickedUpClicked
    })
  }

  componentDidMount() {
    if (this.props.calculateRoute === "true") {
      setTimeout(
        function() {
          this.calculateAndDisplayRoute();
        }.bind(this),
        50
      );
    }
  }

  initMap() {
    this.geocoder = new google.maps.Geocoder();

    //Create the map component
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: this.state.coordinates.lat,
        lng: this.state.coordinates.lng
      },
      zoom: 10
    });

    // Add Event listener to map
    // Create new Info Window and Marker for each clicked location
    google.maps.event.addListener(
      this.map,
      "click",
      function(event) {
        if (this.state.numberOfClicksAllowed > 0) {
          this.addInfoWindowForLocation(event, this.geocoder);
        }
      }.bind(this)
    );

    this.setState({
      directionsService: new google.maps.DirectionsService(),
      directionsDisplay: new google.maps.DirectionsRenderer({
        map: this.map
      })
    });

    //Initialize the autocomplete text field
    if (this.state.showAutoCompleteBar) {
      this.initAutocomplete(this.geocoder);
    }
  }

  xy = openPackages => {
    return new Promise((res, rej) => {
      let routeTimes = [];

      for (let i = 0; i < openPackages.length; i++) {
        this.state.directionsService.route(
          {
            origin: this.state.startLocation,
            destination: openPackages[i].location,
            travelMode: google.maps.TravelMode.DRIVING
          },
          function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              this.state.directionsDisplay.setDirections(response);
              let duration = 0;

              let dirRoutes = this.state.directionsDisplay.directions;
              for (let i = 0; i < dirRoutes.routes[0].legs.length; i++) {
                duration += dirRoutes.routes[0].legs[i].duration.value;
              }
              routeTimes.push({
                duration: duration,
                location: openPackages[i]
              });

              res(routeTimes);
            } else {
              alert("No routes found");
              rej("No route found");
            }
          }.bind(this)
        );
      }
    });
  };

  async oldAlgo() {
    let wayPts = this.state.waypoints;
    let openPackages = this.state.openPackages;
    for (let i = 0; i < wayPts.length; i++) {
      this.state.openPackages.push(wayPts[i]);
    }

    //while(openPackages.length > 0) {

    const routeTimes = await this.xy(openPackages);

    //Get min value of array

    var minOfArray = Number.POSITIVE_INFINITY;
    var tmp;
    for (var i = routeTimes.length - 1; i >= 0; i--) {
      tmp = routeTimes[i].duration;
      if (tmp < minOfArray) minOfArray = tmp;
    }
    console.log(minOfArray);

    let index = 0;
    for (let i = 0; i < routeTimes.length; i++) {
      if (routeTimes[i].duration === minOfArray) {
        index = i;
      }
    }

    console.log(index);
    console.info(minOfArray);
    console.log(this.state.startLocation);
    console.log(routeTimes);
  }

  drawRouteOnMaps = (origin, destination, waypoint, setMap) => {
    return new Promise((res, rej) => {

      if (this.state.directionsService && this.state.directionsDisplay) {
        this.state.directionsDisplay.setMap(null);
        this.state.directionsDisplay.setMap(this.map);
        let totalDistance = 0;
  
        if (waypoint !== null) {
          this.state.directionsService.route(
            {
              origin: origin,
              destination: destination,
              waypoints: waypoint,
              travelMode: google.maps.TravelMode.DRIVING
            },
            function(response, status) {
              if (status === google.maps.DirectionsStatus.OK) {
                this.state.directionsDisplay.setDirections(response);
  
                let dirRoutes = this.state.directionsDisplay.directions;
                for (let i = 0; i < dirRoutes.routes[0].legs.length; i++) {
                  totalDistance += dirRoutes.routes[0].legs[i].distance.value;
                }
                res(totalDistance)
              }else{
                rej("error")
              }
            }.bind(this)
          );
        } else {
          this.state.directionsService.route(
            {
              origin: origin,
              destination: destination,
              travelMode: google.maps.TravelMode.DRIVING
            },
            function(response, status) {
              if (status === google.maps.DirectionsStatus.OK) {
                this.state.directionsDisplay.setDirections(response);
  
                let dirRoutes = this.state.directionsDisplay.directions;
                for (let i = 0; i < dirRoutes.routes[0].legs.length; i++) {
                  totalDistance += dirRoutes.routes[0].legs[i].distance.value;
                }
                res(totalDistance)
              }else{
                rej("error")
              }
            }.bind(this)
          );
        }
        if (!setMap) {
          this.state.directionsDisplay.setMap(null);
        }
      }
    })
  }

  calculateAndDisplayRoute = () => {
    if (this.state.waypoints.length > 1) {

      // Compare distance_current_pickup from all packages and select lowest one
     
      let wayPts = [ ...this.state.waypointsDetails];
      let openPackages = [ ...this.state.waypointsDetails];
      
      // Set set open Packages with all selected packages:
      let pickedUpPackages = [];
      let index = 0;

      (async function loop () {
        while (openPackages.length > 0 ||  pickedUpPackages.length > 0) {
            await new Promise(resolve => {
              setTimeout(resolve, Math.random() * 1000);
            });
            
            let minPackages = {
              min: Number.MAX_VALUE,
              packagedID: "",
              index: 0
            };
            if (index === 0) {
              for (let i = 0; i < wayPts.length; i++) {
                console.log(wayPts[i]);
                if (wayPts[i].distance_current_pickup < minPackages.min) {
                  minPackages.min = wayPts[i].distance_current_pickup;
                  minPackages.packagedID = wayPts[i].parcel_id;
                  minPackages.index = i;
                }
              }

              console.log("OP length "+openPackages.length)
              console.log("PU length "+pickedUpPackages.length)

              // Calculate route this point
              let origin = this.state.startLocation;
              let destination = wayPts[minPackages.index].coords;
              this.lastDestination = wayPts[minPackages.index].coords;
              this.drawRouteOnMaps(origin, destination, null, true);
              
              this.setState({
                currentPackageState: minPackages.index + ": " +origin + ", " + destination
              })
              // remove this point from openPackages and add to pickedUpPackages
      
              if(openPackages.length > 0 ){
                openPackages.splice(minPackages.index, 1);
              }
              pickedUpPackages.push(wayPts[minPackages.index]);
              
              
            } else {
              if(this.state.pickedUpClicked){

                this.setState({
                  startLocation: this.lastDestination,
                  pickedUpClicked: false
                })
                console.log("cliked")
                // Check, whether route from open packages (distance_current_pickup) or pickedUpPAckages is closer
                let distances = [];
                    
                console.log("OP length "+openPackages.length)

                // Get all distances for Open Packages
                for(let i =0; i<openPackages.length; i++){
                  let distance = await this.drawRouteOnMaps(this.state.startLocation, openPackages[i].coords, null, false)
                  distances.push({
                    distance: distance,
                    package: openPackages[i]
                  })
                }
      
                console.log("PU length "+pickedUpPackages.length)
                
                // Get all distances for Pickedup Packages
                for(let i =0; i<pickedUpPackages.length; i++){
                  let distance = await this.drawRouteOnMaps(this.state.startLocation, openPackages[i].destination, null, false)
                  distances.push({
                    distance: distance,
                    package: pickedUpPackages[i]
                  })
                }
                
                for(let i =0; i<distances.length; i++){
                  if(distances[i].distance < minPackages.min){
                    minPackages.min = distances[i].distance;
                    minPackages.packagedID = distances[i].package.parcel_id;
                    minPackages.index = i;
                  }
                }
                
                console.log(distances)
                console.log(minPackages);
                console.log(wayPts)
                 // Calculate route this point
                let origin = this.state.startLocation;
                let destination = wayPts[minPackages.index].destination;
                this.lastDestination = destination;
                console.log(origin, destination )
                this.drawRouteOnMaps(origin, destination, null, true);
                this.setState({
                  currentPackageState: minPackages.index + ": " +origin + ", " + destination
                })
                // remove this point from openPackages and add to pickedUpPackages
        
                if(openPackages.length > 0 ){
                  openPackages.splice(minPackages.index, 1);
                }
                pickedUpPackages.push(wayPts[minPackages.index]);
                
              }
            }
            index++;
          }
      }.bind(this))();

/*      while (openPackages.length > 0) {
        let minPackages = {
          min: Number.MAX_VALUE,
          packagedID: "",
          index: 0
        };
        if (index === 0) {
          for (let i = 0; i < wayPts.length; i++) {
            console.log(wayPts[i]);
            if (wayPts[i].distance_current_pickup < minPackages.min) {
              minPackages.min = wayPts[i].distance_current_pickup;
              minPackages.packagedID = wayPts[i].parcel_id;
              minPackages.index = i;
            }
          }
          console.log(openPackages)
        } else {
          if(this.state.pickedUpClicked){
            console.log("cliked")
            this.setState({
              pickedUpClicked: false
            })
            // Check, whether route from open packages (distance_current_pickup) or pickedUpPAckages is closer
            let distances = [];
                
            // Get all distances for Open Packages
            for(let i =0; i<openPackages.length; i++){
              let distance = this.drawRouteOnMaps(this.state.startLocation, openPackages[i].coords, null, false)
              distances.push({
                distance: distance,
                package: openPackages[i]
              })
            }
  
            // Get all distances for Pickedup Packages
            for(let i =0; i<pickedUpPackages.length; i++){
              let distance = this.drawRouteOnMaps(this.state.startLocation, openPackages[i].destination, null, false)
              distances.push({
                distance: distance,
                package: pickedUpPackages[i]
              })
            }
  
            for(let i =0; i<distances.length; i++){
              if(distances[i].distance < minPackages.min){
                minPackages.min = distances[i].distance;
                minPackages.packagedID = distances[i].package.parcel_id;
                minPackages.index = i;
              }
            }
          }
        }

        // Calculate route this point
        let origin = this.state.startLocation;
        let destination = wayPts[minPackages.index].coords;
        this.drawRouteOnMaps(origin, destination, null, true);

        // remove this point from openPackages and add to pickedUpPackages

        console.log(openPackages.splice(minPackages.index, 1));
        console.log(pickedUpPackages.push(wayPts[minPackages.index]));
        index++;
      }*/
      console.log("Terminated while loop in calc&Displ")
      //Save package with shortest route and its id

      // Set current Location to new point

      /*
      this.setState({
        startLocation: ""
      })
     

      */

      // }
      // set openPackages ={contains all Pickup packages}
      // set pickedUpPackages = {}
      // while(openPackages != empty)
      //  Calculate shortest route from driver to one of the openPackages (pickUp1: p1).
      //  pickedUpPackages = {p1}
      //  Remove p1 from list of openPackages
      //  Check, whether element from pickedUpPackages closer than element from openPackages
      //  if(PickedUpPackages p)
      //      calculate route to (p).
      //     Remove element p from pickedUpPackages
      //  else if (openPackages p)
      //      Remove element from openPackages
      //     Add element to PickedUpPackages
      //     Calculate route to p
      //  If (pickedUp != empty)
      //    Calcuclate route to all pickedUp Packages
      // Terminate when pickUps == empty && destinations == empty
    } else {
      // Aktueller Code
      if (this.state.directionsService && this.state.directionsDisplay) {
        this.state.directionsDisplay.setMap(null);
        this.state.directionsDisplay.setMap(this.map);

        this.state.directionsService.route(
          {
            origin: this.state.startLocation,
            destination: this.state.destination,
            waypoints: this.state.waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true
          },
          function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              this.state.directionsDisplay.setDirections(response);

              let totalDuration = 0;
              let totalDistance = 0;

              let dirRoutes = this.state.directionsDisplay.directions;
              for (let i = 0; i < dirRoutes.routes[0].legs.length; i++) {
                totalDistance += dirRoutes.routes[0].legs[i].distance.value;
                totalDuration += dirRoutes.routes[0].legs[i].duration.value;
              }

              let roundedTotalDistance = totalDistance / 1000;
              roundedTotalDistance = roundedTotalDistance.toFixed(1);

              var date = new Date(null);
              date.setSeconds(totalDuration); // specify value for SECONDS here
              var resultTime = 0;
              if (totalDuration < 3600) {
                resultTime = date.toISOString().substr(14, 5);
              } else {
                resultTime = date.toISOString().substr(11, 8);
                resultTime = date.toISOString().substr(11, 8);
              }

              this.setState({
                duration: resultTime,
                distance: roundedTotalDistance + " km"
              });
            } else {
              window.alert("Directions request failed due to " + status);
            }
          }.bind(this)
        );
      }
    }
  };

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  /**
   * Initialize Autocomplete input
   */
  initAutocomplete(geocoder) {
    if (this.map) {
      let input = document.getElementById("searchTextField");
      let marker = new google.maps.Marker({
        map: this.map
      });

      let autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo("bounds", this.map);

      google.maps.event.addListener(
        autocomplete,
        "place_changed",
        function() {
          this.place = autocomplete.getPlace();

          var newlatlong = new google.maps.LatLng(
            this.place.geometry.location.lat(),
            this.place.geometry.location.lng()
          );
          this.map.setCenter(newlatlong);

          this.checkIfInfoWindowIsReached();
          this.createNewInfoWindow(
            this.place.geometry.location.lat(),
            this.place.geometry.location.lng(),
            geocoder
          );

          if (this.props.callbackFromDriver) {
            this.props.callbackFromDriver({
              lat: this.place.geometry.location.lat(),
              lng: this.place.geometry.location.lng()
            });
          } else if (this.props.callbackFromParent) {
            this.props.callbackFromParent(this.state.coordinates);
          }

          this.map.setZoom(11);
        }.bind(this)
      );
    }
  }

  /**
   * Adds an Info Window when clicked on the map with the named address
   */
  addInfoWindowForLocation(event, geocoder) {
    var infoWindow;

    //Check, whether an Info Window already exists for the current location
    for (let i = 0; i < this.state.mapPositionArray.length; i++) {
      if (
        this.state.mapPositionArray[i].lat === event.latLng.lat() &&
        this.state.mapPositionArray[i].lon === event.latLng.lng()
      ) {
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
      );
    }

    if (this.props.callbackFromParent) {
      this.props.callbackFromParent(this.state.mapPositionArray);
    } else if (this.props.callbackFromDriver) {
      this.props.callbackFromDriver({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
    }
  }

  checkIfInfoWindowIsReached() {
    if (
      this.state.mapPositionArray.length >
      this.state.numberOfClicksAllowed - 1
    ) {
      for (let i = 0; i < this.state.mapPositionArray.length; i++) {
        this.state.mapPositionArray[i].marker.setMap(null);
      }
      this.setState({
        mapPositionArray: []
      });
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
    };

    let newMapPositions = this.state.mapPositionArray;
    newMapPositions.push(mapPosition);
    this.setState({
      mapPositionArray: newMapPositions
    });
    infoWindow = mapPosition.infoWindow;
    marker = mapPosition.marker;

    this.geocodeLatLng(geocoder, this.map, infoWindow, latlng, marker);
  }

  /*
        Get address from coordinates
    */
  geocodeLatLng(geocoder, map, infowindow, coordinates, marker) {
    var latlng = { lat: coordinates.lat, lng: coordinates.lng };
    geocoder.geocode(
      { location: latlng },
      function(results, status) {
        if (status === "OK") {
          if (results[0]) {
            marker.addListener("click", function() {
              infowindow.open(map, marker);
            });

            this.formatted_address = results[0].formatted_address;
            if (this.props.getFormattedAddress) {
              this.props.getFormattedAddress(results[0].formatted_address);
            }
            infowindow.setContent(results[0].formatted_address);
            infowindow.open(map, marker);
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }.bind(this)
    );
  }

  handleDeliveredButtonClick =() => {
    this.setState({
      pickedUpClicked: true
    })
  }

  render() {
    let googleMapURL =
      "https://maps.googleapis.com/maps/api/js?libraries=places&key=" +
      this.state.googleAPIKey;

    return (
      <div>
        {this.state.showAutoCompleteBar ? (
          <input type="text" id="searchTextField" />
        ) : (
          ""
        )}
        <div id="map" />
        <div>
          {this.props.calculateRoute ? (
            <div
              style={{
                margin: "20px 0",
                overflow: "hidden",
                marginLeft: "-24px"
              }}
            >
              <div style={{ float: "left" }}>
                <img
                  style={{
                    width: "42px",
                    marginLeft: "28px",
                    position: "relative",
                    top: "16px"
                  }}
                  alt="Shows an icon of a person"
                  src="/assets/distance1.png"
                />
                <span
                  style={{
                    fontSize: "18px",
                    marginLeft: "15px",
                    fontWeight: 600
                  }}
                >
                  {this.state.distance}
                </span>
                <span className="route-details" ref={this.distanceLabel}>
                  Distance
                </span>
              </div>
              <div style={{ marginLeft: "20px", overflow: "hidden" }}>
                <img
                  style={{
                    width: "42px",
                    marginLeft: "28px",
                    position: "relative",
                    top: "20px"
                  }}
                  alt="Shows an icon of a person"
                  src="/assets/duration.png"
                />
                <span
                  style={{
                    fontSize: "18px",
                    marginLeft: "15px",
                    fontWeight: 600
                  }}
                >
                  {this.state.duration}
                </span>
                <span className="route-details" ref={this.durationLabel}>
                  Duration{" "}
                </span>
                <div>
                  {this.state.currentPackageState}
                </div>
                <button onClick={this.handleDeliveredButtonClick}>Delivered</button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <Script url={googleMapURL} onLoad={this.initMap.bind(this)} />
      </div>
    );
  }
}

export default withAuthentication(Maps);
