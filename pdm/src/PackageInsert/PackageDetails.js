import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import "../App.css";
import {sendPostRequest} from "../API/Requests";
import { withAuthentication, AuthUserContext } from "../Session";

export class PackageDetail extends Component {
  constructor() {
    super();

    this.state = {
      userToken: "",
      packageID: "",
      detailsObj: {},
      detailsArr: [],
      loading: true,
      package: null
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
    setTimeout(function(){ 
      this.setState({
        loading: false
      }) 
    }.bind(this), 1700);
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

  async getUserPackages() {
    //Wrap data into object
    console.log(this.state.userToken);

    let data = JSON.stringify({
      user_token: this.state.userToken,
      action: "detail",
      parcel_id: this.state.packageID
    });

    console.log(data);
    let res = await sendPostRequest("parcel", data);

    if(res){
      this.setState({
        loading: false,
        package: res.data.detail
      })
      this.createArrOfObj(res.data.detail);
    }else{
      this.setState({
        loading: false
      })
      console.log("Error fetching package data.");
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
                  style={{ minHeight: "180px", padding: "25px" }}
                >
                  <div id="my-packages-container">
                    <h2>View your package</h2>
                    <img
                      style={{
                        width: "100px"
                      }}
                      alt="Shows an icon of a package"
                      src="/assets/packing.png"
                    />
                    {this.state.detailsArr.length > 0 ? (
                      this.state.detailsArr.map((key, index) => {
                        return (
                          <div key={index}>
                            <div className="package-detail-attribute">
                              {key[0]}:
                            </div>
                            <div>{(typeof key[1] === 'object') ? key[1].lat.toFixed(5) + ", " + 
                            key[1].lng.toFixed(5) : key[1] }</div>
                          </div>
                        );
                      })
                    ) : (
                      <div>
                        {this.state.loading ? (
                          <div className="loader" />
                        ) : (
                          <div>
                            Package information are currently unavailable. Please check later again.
                          </div>
                        )}
                      </div>
                    )}
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
