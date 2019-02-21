import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import "../App.css";
import axios from "axios";
import firebase from "firebase";
import { Link } from "react-router-dom";
import { withAuthentication, AuthUserContext } from "../Session";

export class MyDrives extends Component {
  constructor() {
    super();

    this.state = {
      drives: [],
      userToken: null
    };

    this.getUserDrives = this.getUserDrives.bind(this);
    this.getUserToken = this.getUserToken.bind(this);
  }

  componentWillMount() {
    this.getUserToken();
  }

  getUserDrives() {
    //Wrap data into object

    let data = JSON.stringify({
      action: "list",
      user_token: this.state.userToken,
      parcel_id: ""
    });
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
        console.log(response.data.list);
        this.setState({
          drives: response.data.list
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getUserToken() {
    if (firebase.auth().currentUser) {
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

  render() {
    return (
      <div className="App">
        <Header />
        <Navigation currentPage="delivery" />
        <div className="main-content">
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? (
                <div
                  className="tile"
                  style={{ padding: "25px", minHeight: "180px" }}
                >
                  <div id="my-packages-container">
                    <h2>Manage your deliveries.</h2>
                    {this.state.drives.length > 0 ? (
                      this.state.drives.map((p, index) => {
                        return (
                          <div className="listed-packages" key={index}>
                            <span className="packages-table">{p}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div id="no-available-div">
                        No deliveries available. <br />
                        You can start a new one by clicking{" "}
                        <Link style={{ color: "#4e83c5" }} to="/driver">
                          here
                        </Link>
                        .
                      </div>
                    )}
                    <Link to="/driver">
                      <button
                        id="add-package-button"
                        className="buttons cta-button"
                      >
                        Add Delivery
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="userNotLoggedIn-label">
                  Please log in to access this page.
                </div>
              )
            }
          </AuthUserContext.Consumer>
        </div>
      </div>
    );
  }
}

export default withAuthentication(MyDrives);
