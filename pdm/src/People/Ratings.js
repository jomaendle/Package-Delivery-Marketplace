import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { withAuthentication, AuthUserContext } from "../Session";
import {sendPostRequest} from "../API/Requests";
import firebase from "firebase";
import "../App.css";

class Ratings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRatings: [],
      loading: true
    };
  }

  getAllRatings = async (e) => {
    let data = JSON.stringify({
      user_token: this.state.userToken
    });

    let response = await sendPostRequest("pd_rating", data);
    console.log(response)
    if(response){
      this.setState({
        userRatings: response.data,
        loading: false
      })
      this.sortByPoints();
    }else{
      this.setState({
        loading: false
      })
    }
  }

  getUserToken = () => {
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
                this.getAllRatings
              );
            }.bind(this)
          )
          .catch(function(error) {
            // Handle error
          });
    }
  }


  sortByPoints = () => {
    let resultArray = this.state.userRatings;
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
      userRatings: resultArray
    });
  }
  

  componentWillMount() {
    this.getUserToken();
  }

  componentDidMount() {
    document.title = "Ratings - Package Delivery Marketplace";
    setTimeout(function() {
      this.setState({
        loading: false
      })
    }.bind(this), 4000)
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Navigation currentPage="ratings" />
        <div className="main-content">
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? (
                <div className="tile">
                  <h2>Ratings</h2>
                  <h4>This page shows all drivers with their current rating.</h4>
                  {this.state.userRatings.length > 0 
                  ? this.state.userRatings.map((driver, index) => {
                    return (
                      <div key={index} className="ratings-div">
                        <span id="ratings-number"> {driver[2]} </span>
                        <span>{driver[1]}</span>
                      </div>
                    );
                  })
                :
                <div>
                  {this.state.loading 
                  ? (
                  <div className="spinner">
                      <div className="bounce1"></div>
                      <div className="bounce2"></div>
                      <div className="bounce3"></div>
                  </div>) 
                  : (
                    <div>
                      Package information are currently unavailable. Please check later again.
                    </div>
                  )}
                </div>
                }
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

export default withAuthentication(Ratings);
