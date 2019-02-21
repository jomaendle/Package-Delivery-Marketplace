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
      userToken: "",
      packageID: "",
      detailsObj: {},
      detailsArr: []
    };

    this.getUserPackages = this.getUserPackages.bind(this);
  }

  componentWillMount() {
    if (this.props.location.state) {
      this.setState({
        packageID: this.props.location.state.currentPackageID,
        userToken: this.props.location.state.userToken
      });
    }
  }

  componentDidMount() {
    this.getUserPackages();
  }

  createArrOfObj(arr) {
    if (arr) {
      var result = Object.keys(arr).map(function(key) {
        return [key, arr[key]];
      });
      console.log(result);
      this.setState({
        detailsArr: result
      });
    }
    console.log(this.state);
  }

  getUserPackages() {
    //Wrap data into object
    console.log(this.state.userToken);

    let data = JSON.stringify({
      user_token: this.state.userToken,
      action: "detail",
      parcel_id: this.state.packageID
    });

    console.log(data);

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
        console.log(response.data.detail);
        this.createArrOfObj(response.data.detail);
      })
      .catch(error => {
        console.log(error);
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
                <div
                  className="tile"
                  style={{ minHeight: "180px", padding: "25px" }}
                >
                  <div id="my-packages-container">
                    <h2>View your package</h2>
                    <img style={{
                    width: "100px",
                    }} alt="Shows an icon of a package" src="/assets/packing.png"/>
                    {this.state.detailsArr
                      ? this.state.detailsArr.map((key, index) => {
                          return (
                            <div key={index}>
                              <div className="package-detail-attribute">{key[0]}:</div>
                              <div>{key[1]}</div>
                            </div>
                          );
                        })
                      : ""}
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

export default withAuthentication(PackageDetail);
