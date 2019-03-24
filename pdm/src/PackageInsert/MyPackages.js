import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import "../App.css";
import {sendPostRequest} from "../API/Requests"
import firebase from "firebase";
import { Link } from "react-router-dom";
import { withAuthentication, AuthUserContext } from "../Session";

export class MyPackages extends Component {
  constructor() {
    super();

    this.state = {
      packages: [],
      userToken: null,
      loading: true
    };

    this.getUserPackages = this.getUserPackages.bind(this);
    this.getUserToken = this.getUserToken.bind(this);
  }

  componentWillMount() {
    this.getUserToken();
    setTimeout(function(){ 
      this.setState({
        loading: false
      }) 
    }.bind(this), 4000);
  }

  componentDidMount() {
    document.title = "My Packages - Package Delivery Marketplace"
  }

  async getUserPackages() {
    //Wrap data into object
    let data = JSON.stringify({
      action: "list",
      user_token: this.state.userToken,
      parcel_id: ""
    });
    
    let response = await sendPostRequest("parcel", data);

    if(response){
      console.log(response)
      this.setState({
        packages: response.data.list,
        loading: false
      });
      this.sortPackagesByTime();
    }else{
      this.setState({
        loading: false
      })
      console.log("Error fetching user packages.")
    }
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
    e.preventDefault();
    this.props.history.push({
      pathname: "/package-details",
      state: {
        currentPackageID: p[0],
        userToken: this.state.userToken
      }
    });
  }

  diffHours = date => {
    let dt2 = new Date();
    let dt1 = new Date(date);
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    if (Math.abs(Math.round(diff)) >= 24) {
        return Math.round(Math.abs(Math.round(diff)) / 24) + " d ago";
    } else {
        return Math.abs(Math.round(diff)) + " h ago";
    }
  };

  sortPackagesByTime = () => {
    let resultArray = this.state.packages;
    resultArray.sort(function(a, b) {
        var dateA = new Date(a[2]);
        var dateB = new Date(b[2]);

        if (dateA < dateB) {
            return 1;
        }
        if (dateA > dateB) {
            return -1;
        }
        return 0;
    });

    this.setState({
      packages: resultArray
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
                <div className="tile">
                  <div id="my-packages-container">
                    <h2>Manage your packages.</h2>

                    {this.state.packages.length ? this.state.packages.map((p, index) => {
                      return (
                        <div
                          className="listed-packages parcel-link"
                          key={index}
                          onClick={e => this.showPackageDetail(e, p)}
                        >
                          <span  id="packages-table-heading" className="packages-table">
                          <img
                              style={{
                                width: "28px",
                                top: "8px",
                                position: "relative",
                                marginRight: "8px"
                              }}
                              alt="Shows an a packaging box."
                              src="/assets/box.png"
                            />
                            Package {index+1}
                          </span>
                          <span className="packages-table">{p[0]}</span>
                          <span id="my-packages-status-label" className="packages-table">{p[1]}</span>
                          
                            {p[3] 
                              ? (
                                <div>
                                  <span className="packages-table">
                                  <img
                                  style={{
                                      width:"18px",
                                      top:"4px",
                                      position: "relative",
                                      marginRight:"8px"}}
                                  alt="Shows a message icon"
                                  src="/assets/chat.png"/>
                                  {p[3]}
                                  </span>
                                </div>
                                
                                ) 
                              : ""}
                          <span className="packages-table"  style={{position:"absolute",top: "10px",right: "5px"}}>
                          <img
                            style={{
                                width:"18px",
                                top:"4px",
                                position:"relative",
                                marginRight:"8px"}}
                            alt="Shows a clock"
                            src="/assets/past.png"
                        />
                        {this.diffHours(p[2])}</span>
                        </div>
                      );
                    }) 
                    
                    : (
                      <div id="no-available-div">
                          {this.state.loading 
                          ? (<div className="spinner">
                              <div className="bounce1"></div>
                              <div className="bounce2"></div>
                              <div className="bounce3"></div>
                            </div>)
                          : (
                            <div>
                              No packages available. <br/>
                              You can insert a new one by clicking <Link style={{ color: "#4e83c5"}} to="/new-package">here</Link>.
                            </div>
                          ) }
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

export default withAuthentication(MyPackages);
