import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import "../App.css";
import { withAuthentication, AuthUserContext } from "../Session";
require("dotenv").config();

export class ConfirmationPage extends Component {
  constructor() {
    super();

    this.state = {
      selectedPackages: [],
      timeAvailable: 0,
      currentLatLng: {
        lat: "",
        lng: ""
      }
    };
    this.ReturnToPreviousPage = this.ReturnToPreviousPage.bind(this);
    this.continueToFinalPage = this.continueToFinalPage.bind(this);
  }

  componentWillMount() {
    if (this.props.location.state) {
      this.setState({
        selectedPackages: this.props.location.state.selectedPackages,
        radius: this.props.location.state.prevState.radius,
        currentLatLng: this.props.location.state.prevState.currentLatLng
      });
    }
    console.log(this.props.location.state)
  }

  ReturnToPreviousPage() {
    this.props.history.push({
      pathname: "/driver-select-packages",
      state: {
        selectedPackages: this.state.selectedPackages
      }
    });
  }

  continueToFinalPage() {
    this.props.history.push({
      pathname: "/driver-route",
      state: {
        selectedPackages: this.state.selectedPackages,
        currentLatLng: this.state.currentLatLng
      }
    });
  }

  render() {
    if (this.state.selectedPackages) {
      return (
        <div className="App">
          <Header />
          <Navigation currentPage="delivery" />
          <div className="main-content">
            <AuthUserContext.Consumer>
              {authUser =>
                authUser ? (
                  <div className="tile">
                    <h2>Congrats! Check your information and submit</h2>
                    <div>
                      <p style={{ marginBottom: "45px" }}>
                        <span style={{ fontWeight: 600 }}>
                          Your selected radius is:
                        </span>{" "}
                        {this.state.radius}
                      </p>
                      <p style={{ marginBottom: "45px" }}>
                        <span style={{ fontWeight: 600 }}>
                          Your current position is:
                        </span>{" "}
                        {this.state.currentLatLng.address}
                        {this.state.currentLatLng.lat.toFixed(4)} ,{" "}
                        {this.state.currentLatLng.lng.toFixed(4)}
                      </p>

                      <p>
                        <span style={{ fontWeight: 600 }}>
                          You selected the following packages to deliver:
                        </span>
                      </p>
                      {this.state.selectedPackages.map((p, index) => {
                        return (
                          <div
                            className="listed-packages"
                            key={index}
                          >
                            <span id="packages-table-heading" className="packages-table">
                              <img style={{
                              width: "28px",
                              top: "8px",
                              position: "relative",
                              marginRight: "8px"
                              }} alt="Shows an a route with multiple waypoints." src="/assets/box.png"/>
                              Package {index+1} 
                            </span>
                            <span className="packages-table">
                            <b>{(p.distance_current_pickup/1000).toFixed(2)} km </b> Your location - Pickup 
                            </span>
                            <span className="packages-table">
                            <b>{(p.distance_pickup_destination/1000).toFixed(2)} km </b> Pickup - Destination 
                            </span>
                            <span className="packages-table" style={{fontSize: "18px", display: "inline-block"}}>
                            <b>{((p.distance_pickup_destination/1000) + 
                                (p.distance_current_pickup/1000)).toFixed(2)} km </b> Combined 
                            </span>
                            <span style={{float: "right", fontSize: "20px"}}>
                             <b> {(p.potential_earning / 100).toFixed(2)}€ </b>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="buttons"
                      onMouseDown={this.ReturnToPreviousPage}
                    >
                      Back
                    </button>
                    <button
                      className="buttons cta-button"
                      onMouseDown={this.continueToFinalPage}
                      style={{ float: "right" }}
                    >
                      Confirm
                    </button>
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
    } else {
      return (
        <div>
          <div className="App">
            <Header />
            <Navigation />
            <div className="main-content">
              <h3>Congrats! Check your information and submit</h3>
              <h4 />
              <div />
              <button
                className="buttons"
                onMouseDown={this.ReturnToPreviousPage}
              >
                Back
              </button>
              <button className="buttons" style={{ float: "right" }}>
                Submit
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withAuthentication(ConfirmationPage);
