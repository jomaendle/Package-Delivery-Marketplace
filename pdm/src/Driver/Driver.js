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
      time: 0,
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
        time: "Hours: 5"
      });
    } else {
      this.setState({
        time: "Hours: 5"
      });
    }
  }

  updateTimeLabel(e) {
    e.preventDefault();
    this.setState({
      time: "Hours: " + this.rangeRef.current.value
    });
  }

  handleSubmit = e => {
    this.props.history.push({
      pathname: "/driver-select-packages",
      state: {
        currentLatLng: this.state.currentLatLng,
        timeAvailable: this.state.time
      }
    });
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
                <div>
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
                          allowMultipleClicks="false"
                          showAutoCompleteBar="true"
                        />
                        <p className="p-border">
                          <span style={{ fontWeight: 600 }}>
                            How much time do you have for delivering?
                          </span>
                          <br />
                          <br />
                          <span style={{ marginRight: "15px" }}>
                            {this.state.time}
                          </span>
                          <input
                            type="range"
                            ref={this.rangeRef}
                            name="priority"
                            min="1"
                            max="5"
                            style={{ width: "250px", marginTop: "15px" }}
                            onChange={e => {
                              this.updateTimeLabel(e);
                            }}
                          />
                        </p>
                      </div>
                      <div style={{ marginTop: "20px" }}>
                        <button
                          className="buttons cta-button"
                          onMouseDown={this.handleSubmit}
                          style={{ float: "right" }}
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
