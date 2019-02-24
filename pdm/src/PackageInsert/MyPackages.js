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

  async getUserPackages() {
    //Wrap data into object
    let data = JSON.stringify({
      action: "list",
      user_token: this.state.userToken,
      parcel_id: ""
    });
    
    let response = await sendPostRequest("parcel", data);

    if(response){
      this.setState({
        packages: response.data.list,
        loading: false
      });
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
    this.props.history.push({
      pathname: "/package-details",
      state: {
        currentPackageID: p,
        userToken: this.state.userToken
      }
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
                          {this.state.loading 
                          ? (<div className="loader"></div>)
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
