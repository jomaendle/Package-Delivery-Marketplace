import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import "../App.css";
import axios from "axios";
import { withAuthentication, AuthUserContext } from "../Session";

export class PackageDetail extends Component {
  constructor() {
    super();

    this.state = {
        userToken: ""
    }

    this.getUserPackages = this.getUserPackages.bind(this);
    this.getUserToken = this.getUserToken.bind(this);
  }

  componentWillMount() {
    this.getUserToken();
  }

  componentDidMount() {
    this.getUserPackages()
  }

  getUserPackages() {
      //Wrap data into object

      let pID;
      if (this.props.location.state) {
         pID = this.props.location.state.currentPackageID
      }
    console.log(this.state.userToken) 

    let data = JSON.stringify({
        user_token: this.state.userToken,
        action: "detail",
        parcel_id: pID
    });

    console.log(data)

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
        console.log(response);
        this.setState({
          packages: response.data.list
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getUserToken() {
    var user = this.props.firebase.auth.currentUser;
    if(user){
        user.getIdToken(true).then(
          function(idToken) {
              this.setState({
                  userToken: idToken
              })
            console.log(idToken);
          }.bind(this)
        );
    }
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
                <div
                  className="tile"
                  style={{ minhHight: "180px", padding: "25px" }}
                >
                  <div id="my-packages-container">
                    <h2>View your package.</h2>
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

export default withAuthentication(PackageDetail);
