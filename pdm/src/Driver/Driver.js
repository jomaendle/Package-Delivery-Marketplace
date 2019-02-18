import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import "../App.css";
import Map from "../components/Maps";
import { withAuthentication } from "../Session";
import { AuthUserContext } from "../Session";
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
    if (this.props.location.state) {
      this.setState({
        userToken: this.props.location.state.userToken
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
        this.props.history.push({
            pathname: "/driver-select-packages",
            state: {
                currentLatLng: this.state.currentLatLng,
                radius: this.state.radius
            }
        });
    }
  };

  getDataFromMaps = data => {
    console.log("received: " +data)
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
                <div>
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
