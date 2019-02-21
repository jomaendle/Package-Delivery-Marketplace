import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import "../App.css";
import Map from "../components/Maps";
import axios from "axios";
import firebase from "firebase";
import { withAuthentication } from "../Session";
import { AuthUserContext } from "../Session";
require("dotenv").config();

export class Driver extends Component {
  constructor() {
    super();

    this.state = {
      startLocation: {
        lat: 0,
        lng: 0
      },
      destination: {
        lat: 48.558917,
        lng: 9.211809
      },
      time: 0,
      userToken: null,
      selectedPackages: [],
      packagesWithCoords: []
    };

    this.pickedUpButton = React.createRef();
    this.submittedButton = React.createRef();
  }

  componentWillMount() {
    //Get start location and destination
    console.log(this.props.location.state);
    
    if (this.props.location.state) {
      this.setState({
        startLocation: this.props.location.state.currentLatLng,
        userToken: this.props.location.state.userToken,
        selectedPackages: this.props.location.state.selectedPackages
      });
    }
  }

  getUserToken = () => {
    if(firebase.auth().currentUser){
        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(
            function(idToken) {
              this.setState(
                {
                  userToken: idToken
                }
              );
            }.bind(this)
          )
          .catch(function(error) {
            // Handle error
          });
    }
}

  componentDidMount() {
    if(this.state.selectedPackages.length > 0){
      this.state.selectedPackages.map((entry) => {

        this.getUserPackages(entry.parcel_id)
      })

    }
    //this.submittedButton.disabled = true;
  }

  getUserPackages(packageID) {
    //Wrap data into object
    console.log(this.state.userToken);

    let data = JSON.stringify({
      user_token: this.state.userToken,
      action: "detail",
      parcel_id: packageID
    });

    console.log(data);

    //Send HTTP Post request
    axios
      .post(
        "https://us-central1-studienarbeit.cloudfunctions.net/parcel",
        data,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        console.log(response.data);
        //this.state.packagesWithCoords.push()
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleSubmit = e => {
    this.props.history.push({
      pathname: "/driver-select-packages",
      state: {
        currentLatLng: this.state.currentLatLng
      }
    });
  };

  handlePickUp = (e) => {
    e.preventDefault();
    e.target.disabled = true;
    e.target.classList.add("button-disabled");
    e.target.classList.remove("buttons");
    
    //API Call to set Button status to delivery
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Navigation currentPage="delivery" />
        <div className="main-content">
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? (
                <div className="tile">
                  <h2>Here's your route!</h2>
                  <Map
                    allowMultipleClicks="false"
                    showAutoCompleteBar="false"
                    startLocation={this.state.startLocation}
                    destination={this.state.destination}
                    calculateRoute="true"
                  />

                  <button className="buttons" ref={this.pickedUpButton} onClick={this.handlePickUp}>
                    Picked Up
                  </button>
                  <button
                    className="buttons cta-button"
                    ref={this.submittedButton}
                    style={{ float: "right" }}
                  >
                    Delivered
                  </button>
                </div>
              ) : (
                <div>
                  <div className="userNotLoggedInlabel">
                    Please log in to access this page.
                  </div>
                </div>
              )
            }
          </AuthUserContext.Consumer>
        </div>
      </div>
    );
  }
}

export default withAuthentication(Driver);
