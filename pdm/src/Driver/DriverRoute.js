import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import "../App.css";
import Map from "../components/Maps";
import { withAuthentication } from "../Session";
import { AuthUserContext } from "../Session";

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
      waypoints: [],
      pickedUpClicked: false
    };

    this.pickedUpButton = React.createRef();
    this.submittedButton = React.createRef();
    this.mapsRef = React.createRef();
  }

  componentWillMount() {
    //Get start location and destination
    console.log(this.props.location.state);
    console.log("here")
    
    if (this.props.location.state) {
      this.setState({
        startLocation: this.props.location.state.currentLatLng,
        userToken: this.props.location.state.userToken,
        selectedPackages: this.props.location.state.selectedPackages,
        waypoints: this.props.location.state.waypoints,
        destination: this.props.location.state.destination
      });
    }
  }

  componentDidMount() {
    document.title = "Your Route - Package Delivery Marketplace"
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
                    waypoints={this.state.waypoints}
                    destination={this.state.destination}
                    pickedUpClicked={this.state.pickedUpClicked}
                    userToken={this.state.userToken}
                    calculateRoute="true"
                  />

            
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
