import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import axios from "axios";
import "../App.css";
import { withAuthentication, AuthUserContext } from "../Session";
require("dotenv").config();

export class Package extends Component {
  _packageSelected = false;
  constructor() {
    super();

    this.state = {
      packages: [],
      selectedPackages: [],
      userToken: null
    };
    this.handlePackageClick = this.handlePackageClick.bind(this);
    this.ReturnToPreviousPage = this.ReturnToPreviousPage.bind(this);
    this.ContinueToConfirmPage = this.ContinueToConfirmPage.bind(this);
  }

  componentWillMount() {
    if(this.props.location.state){
      this.setState({
        radius: this.props.location.state.radius,
        userToken: this.props.location.state.userToken,
        currentLatLng: this.props.location.state.currentLatLng,
      })
      this.getDriverPackages();
    }
  }

  getDriverPackages = () => {
    // API Call to fetch the parcels which fit for the driver
    console.log(this.props.location.state);
    if (
      this.props.location.state.currentLatLng &&
      this.props.location.state.userToken &&
      this.props.location.state.radius
    ) {
      //Wrap data into object
      let data = JSON.stringify({
        driver_position:
          this.props.location.state.currentLatLng.lat +
          "," +
          this.props.location.state.currentLatLng.lng,
        radius: this.props.location.state.radius,
        user_token: this.props.location.state.userToken
      });

      //Send HTTP Post request
      axios
        .post(
          "https://us-central1-studienarbeit.cloudfunctions.net/pd_suggestions",
          data,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(response => {
          console.log(response);
          this.setState({
            packages: response.data
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  handlePackageClick = (e, index) => {   
      //Add new package to currently selected packages.
      this.state.selectedPackages.push(this.state.packages[index]);
      if(e.target.tagName === "DIV"){
        e.target.className = "listed-packages-clicked";
      }else if(e.target.tagName === "SPAN" && e.target.parentElement.tagName === "DIV"){
        e.target.parentElement.className = "listed-packages-clicked";
      }
  };

  ReturnToPreviousPage() {
    this.props.history.push({
      pathname: "/driver",
      state: {
        currentLatLng: this.state.currentLatLng
      }
    });
  }

  ContinueToConfirmPage() {
    if (this.state.selectedPackages.length === 0) {
      alert("Select at least one package");
    } else {
      this.props.history.push({
        pathname: "/driver-confirm",
        state: {
          prevState: this.props.location.state,
          selectedPackages: this.state.selectedPackages
        }
      });
    }
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
                  <h2>Select one or more packages to proceed.</h2>
                  <div>
                    {this.state.packages.length !== 0 ? (
                      this.state.packages.map((p, index) => {
                        return (
                          <div
                            className="listed-packages"
                            key={index}
                            onMouseDown={e => this.handlePackageClick(e, index)}
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
                      })
                    ) : (
                      <div style={{ marginBottom: "25px" }}>
                        There are no packages available right now. Please check
                        later again.
                      </div>
                    )}
                  </div>
                  <button
                    className="buttons"
                    onMouseDown={this.ReturnToPreviousPage}
                  >
                    Back
                  </button>
                  <button
                    className="buttons cta-button"
                    onMouseDown={this.ContinueToConfirmPage}
                    style={{ float: "right" }}
                  >
                    Continue
                  </button>
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
