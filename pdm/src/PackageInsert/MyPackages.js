import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import "../App.css";
import axios from "axios";
import firebase from "firebase";
import { Link } from "react-router-dom";
import { withAuthentication, AuthUserContext } from "../Session";

export class MyPackages extends Component {
  constructor() {
    super();

    this.state = {
      packages: [],
      userToken: null
    };

    this.getUserPackages = this.getUserPackages.bind(this);
    this.getUserToken = this.getUserToken.bind(this);
  }

  componentWillMount() {
    this.getUserToken();
  }

  getUserPackages() {
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
          packages: response.data.list
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getUserToken() {
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

  showPackageDetail = (e, p) => {
    this.props.history.push({
      pathname: "/package-details",
      state: {
        currentPackageID: p,
        userToken: this.state.userToken
      }
    });
  }

  /*removePackage(e, p_id) {
    if (this.state.packages.length > 0) {
      e.preventDefault();
      if (e.target.parentElement.id !== "my-packages-container") {
        e.target.parentElement.classList.add("hidden");
        setTimeout(
          function() {
            let filteredArray = this.state.packages.filter(
              item => item.parcel_id !== p_id
            );
            this.setState({ packages: filteredArray });
          }.bind(this),
          1150
        );
      }
    }
  }*/

  render() {
    return (
      <div className="App">
        <Header />
        <Navigation currentPage="package" />
        <div className="main-content">
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? (
                <div className="tile" style={{minHeight: "180px", padding: "25px"}}>
                  <div id="my-packages-container">
                    <h2>Manage your packages.</h2>

                    {this.state.packages.length ? this.state.packages.map((p, index) => {
                      return (
                        <div
                          className="listed-packages"
                          key={index}
                          onClick={e => this.showPackageDetail(e, p)}
                        >
                          <span className="packages-table">{p}</span>

                        </div>
                      );
                    }) 
                    
                    : (
                      <div id="no-available-div">
                          No packages available. <br/>
                          You can insert a new one by clicking <Link style={{ color: "#4e83c5"}} to="/new-package">here</Link>.
                      </div>
                    )}
                    <Link to="/new-package">
                      <button
                        id="add-package-button"
                        className="buttons cta-button"
                      >
                        Add Package
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

export default withAuthentication(MyPackages);
