import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import "../App.css";
import Map from "../components/Maps";
import { withAuthentication } from "../Session";
import { AuthUserContext } from "../Session";
import firebase from "firebase";
require("dotenv").config();

export class Driver extends Component {
  constructor() {
    super();

    this.state = {
      currentLatLng: {
        lat: 0,
        lng: 0,
        address: ""
      },
      radius: 0,
      userToken: null
    };

    this.rangeRef = React.createRef();
  }

  componentWillMount() {
    this.getUserToken();
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
                },
                this.getUserPackages
              );
            }.bind(this)
          )
          .catch(function(error) {
            // Handle error
          });
    }
}

  componentDidMount() {
    if (this.props.location.state) {
      this.setState({
        userToken: this.props.location.state.userToken,
        radius: "50 km"
      });
    } else {
      this.setState({
        radius: "50 km"
      });
    }
  }

  receiveAddress = (address) => {
    this.setState({
      formattedAddress: address
    })
  }

  updateRadiusLabel(e) {
    e.preventDefault();
    this.setState({
      radius: this.rangeRef.current.value + " km"
    });
  }

  handleSubmit = e => {
      if(this.state.currentLatLng.lat === 0 && this.state.currentLatLng.lng === 0){
          window.alert("Please select your location first");
        }else{

        // Remove "km" from radius for further procedure
        let radiusNum = this.state.radius.match(/\d/g);
        radiusNum = radiusNum.join("");

        this.props.history.push({
            pathname: "/driver-select-packages",
            state: {
                userToken: this.state.userToken,
                currentLatLng: this.state.currentLatLng,
                radius: radiusNum,
                formattedAddress: this.state.formattedAddress
            }
        });
    }
  };

  getDataFromMaps = data => {
    this.setState({
      currentLatLng: data
    });
  };

  render() {
    return (
      <div className="App">
        <Header />
        <Navigation currentPage="delivery" />
        <div className="main-content">
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? (
                <div id="driver-site-div" className="tile">
                  <div>
                    <h2>Want to deliver packages?</h2>
                    <div>
                      <div>
                        <span
                          style={{
                            marginBottom: "15px",
                            marginTop: "40px",
                            display: "block",
                            fontWeight: 600
                          }}
                        >
                          Select your current location
                        </span>
                        <Map
                          callbackFromDriver={this.getDataFromMaps}
                          getFormattedAddress={this.receiveAddress}
                          numberOfClicksAllowed ="1"
                        />
                        <p className="p-border">
                          <span style={{ fontWeight: 600 }}>
                            How far do you want to deliver?
                          </span>
                          <br />
                          <span style={{ marginRight: "10px", display: "inline-block", width: "50px" }}>
                            {this.state.radius}
                          </span>
                          <input
                            type="range"
                            ref={this.rangeRef}
                            name="priority"
                            min="1"
                            max="50"
                            style={{ width: "170px", marginTop: "15px" }}
                            onChange={e => {
                              this.updateRadiusLabel(e);
                            }}
                          />
                        </p>
                      </div>
                      <div style={{ marginTop: "20px" }}>
                        <button
                        
                          className="buttons cta-button"
                          onMouseDown={this.handleSubmit}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="tile">
                  <div className="userNotLoggedIn-label">
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
