import React, { Component } from "react";
import {sendPostRequest} from "../API/Requests"
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Map from "../components/Maps";
import "../App.css";
import firebase from "firebase/app";
import { withAuthentication, AuthUserContext } from "../Session";
require("dotenv").config();

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
      showSecondMarker: false,
      mapPositionArray: [],
      priority: "",
      price: "",
      userToken: null
    };
    //  this.handleMapClick = this.handleMapClick.bind(this);
    this.clearValues = this.clearValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.continueToFinalPage = this.continueToFinalPage.bind(this);
    this.getUserToken = this.getUserToken.bind(this);

    //Create refs
    this.rangeRef = React.createRef();
    this.sizeRef = React.createRef();
    this.weightRef = React.createRef();
    this.commentRef = React.createRef();
    this.priceRef = React.createRef();
  }

  componentWillMount() {
    this.getUserToken();
  }

  componentDidMount() {
    this.setState({
      priority: "Priority: Very High",
      price: "Price: 50€"
    });
  }

  getDataFromMaps = data => {
    this.setState({
      mapPositionArray: data
    });
  };

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
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.state.mapPositionArray.length === 2) {
      const size = this.sizeRef.current.value;
      const weight = this.weightRef.current.value;
      const priority = this.rangeRef.current.value;
      const comment = this.commentRef.current.value;
      const price = this.priceRef.current.value;
      const token = this.state.userToken;
      let res;
      console.log(token);

      //Get start location
      let startLocation = {
        lat: this.state.mapPositionArray[0].lat,
        lng: this.state.mapPositionArray[0].lon
      };

      //Get destination of package
      let destination = {
        lat: this.state.mapPositionArray[1].lat,
        lng: this.state.mapPositionArray[1].lon
      };

      //Wrap data into object
      let data = JSON.stringify({
        action: "submit",
        user_token: token,
        price: price,
        size: size,
        weight: weight,
        priority: priority,
        comment: comment,
        pickup_location: startLocation,
        destination_location: destination
      })

      let response = await sendPostRequest("parcel", data)
      if(response){
        this.continueToFinalPage(data, res, true);
        console.log(response)
      }else {
        this.continueToFinalPage(data, res, false);
      }
    } else {
      alert("Please select the start and final destination of the package. ");
    }
  };

  getUserToken() {
      if(firebase.auth().currentUser){
          firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            this.setState({
                userToken: idToken
            })
          }.bind(this)).catch(function(error) {
            // Handle error
          });
      }
  }

  redirectToCompletePage() {
    this.props.history.push({
      pathname: "/driver",
      state: {
        currentLatLng: this.state.currentLatLng
      }
    });
  }

  updatePriorityLabel(e) {
    e.preventDefault();
    let value = "";
    switch (this.rangeRef.current.value) {
      case "1":
        value = "Very low";
        break;
      case "2":
        value = "Low";
        break;
      case "3":
        value = "Normal";
        break;
      case "4":
        value = "High";
        break;
      case "5":
        value = "Very High";
        break;
      default:
        value = "";
        break;
    }
    this.setState({
      priority: "Priority: " + value
    });
  }

  updatePriceLabel(e) {
    e.preventDefault();
    this.setState({
      price: "Price: " + this.priceRef.current.value + "€"
    });
  }

  continueToFinalPage(currentPackage, res, boolean) {
    this.props.history.push({
      pathname: "/final",
      state: {
        userType: "customer",
        package: currentPackage,
        response: res,
        success: boolean
      }
    });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Navigation currentPage="package" />
        <div className="main-content">
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? (
                <div id="driver-site-div" className="tile">
                  <h2>Insert a new package to the marketplace</h2>
                  <div>
                    <Map 
                    callbackFromParent={this.getDataFromMaps}
                    numberOfClicksAllowed ="2"/>
                    <form onSubmit={this.handleSubmit}>
                      <p className="p-border">
                        <span style={{ fontWeight: 600 }}>
                          What's the size of your package?
                        </span>
                        <select
                          name="size"
                          ref={this.sizeRef}
                          className="package-insert-select"
                        >
                          <option value="S">S (35 x 25 x 10 cm)</option>
                          <option value="M">M (60 x 30 x 15 cm)</option>
                          <option value="L">L (120 x 60 x 60 cm)</option>
                        </select>
                      </p>
                      <p className="p-border">
                        <span style={{ fontWeight: 600 }}>
                          How heavy is it?
                        </span>
                        <select
                          name="weight"
                          ref={this.weightRef}
                          className="package-insert-select"
                        >
                          <option value="light">Up to 2 Kg</option>
                          <option value="medium">Up to 5 Kg</option>
                          <option value="heavy">Up to 10 Kg</option>
                        </select>
                      </p>
                      <div style={{ marginTop: "10px" }}>
                        <p className="p-border">
                          <span style={{ fontWeight: 600 }}>
                            What priority should it have?
                          </span>{" "}
                          <br />
                          <span
                            style={{
                              marginRight: "20px",
                              display: "inline-block",
                              width: "135px"
                            }}
                          >
                            {this.state.priority}
                          </span>
                          <input
                            type="range"
                            ref={this.rangeRef}
                            name="priority"
                            min="1"
                            max="5"
                            style={{ width: "250px" }}
                            onChange={e => {
                              this.updatePriorityLabel(e);
                            }}
                          />
                        </p>
                        <p className="p-border">
                          <span style={{ fontWeight: 600 }}>
                            Whats your maximum price?
                          </span>{" "}
                          <br />
                          <span
                            style={{
                              marginRight: "20px",
                              display: "inline-block",
                              width: "135px"
                            }}
                          >
                            {this.state.price}
                          </span>
                          <input
                            type="range"
                            ref={this.priceRef}
                            name="price"
                            min="1"
                            max="100"
                            style={{ width: "250px" }}
                            onChange={e => {
                              this.updatePriceLabel(e);
                            }}
                          />
                        </p>
                      </div>
                      <p className="p-border">
                        <span style={{ fontWeight: 600 }}>Any Comments?</span>
                        <textarea
                          id="package-comment"
                          name="comment"
                          className="package-insert-select"
                          ref={this.commentRef}
                        />
                      </p>
                      <div id="selected-locations">
                        <div className="speech-bubble" />
                        <div style={{ lineHeight: "19px" }}>
                          <span style={{ fontWeight: 600 }}>
                            Start Location
                          </span>{" "}
                          <br />
                          {this.state.startLocation.lat
                            ? this.state.startLocation.lat.toFixed(3)
                            : "0"}
                          ,{" "}
                          {this.state.startLocation.lng
                            ? this.state.startLocation.lng.toFixed(3)
                            : "0"}
                        </div>
                        <br />
                        <div style={{ lineHeight: "19px" }}>
                          <span style={{ fontWeight: 600 }}> Destination </span>{" "}
                          <br />
                          {this.state.destination.lat
                            ? this.state.destination.lat.toFixed(3)
                            : "0"}
                          ,{" "}
                          {this.state.destination.lng
                            ? this.state.destination.lng.toFixed(3)
                            : "0"}
                        </div>
                      </div>
                      <div style={{ marginTop: "20px" }}>
                        <button
                          className="buttons critical-button"
                          onMouseDown={this.clearValues}
                        >
                          Clear Values
                        </button>
                        <input
                          className="buttons cta-button"
                          type="submit"
                          style={{ float: "right" }}
                          value="Submit"
                        />
                      </div>
                    </form>
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

export default withAuthentication(Package);
