import React, { Component } from "react";
import Navigation from "./components/Navigation";
import Header from "./components/Header";
import firebase from "firebase/app";
import { withAuthentication, AuthUserContext } from "./Session";
import "./App.css";

class ProfileEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: null,
      username: "",
      email: "",
      phototURL: null
    };

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
    this.getUserData = this.getUserData.bind(this);

    this.successDiv = React.createRef();
    this.failDiv = React.createRef();
  }

  getUserData() {
    var user = this.props.firebase.auth.currentUser;
    if (user != null) {
      this.setState({
        userID: user.uid,
        username: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      });
    }
    console.log(this.state);
  }

  updateUserData() {
    var user = this.props.firebase.auth.currentUser;
    if (user != null) {
      user
        .updateProfile({
          displayName: this.state.username
        })
        .then(function() {
          // Update successful.
          //console.log(this.successDiv)
          this.successDiv.current.style.display = "inherit"
        }.bind(this))
        .catch(function(error) {
          // An error happened.
          this.failDiv.current.style.display = "inherit"
          console.log("Error while changing profile information");
        }.bind(this));
      user
        .updateEmail(this.state.email)
        .then(function() {
          // Update successful.
          this.successDiv.current.style.display = "inherit"
        }.bind(this))
        .catch(function(error) {
          // An error happened.
          this.failDiv.current.style.display = "inherit"
          console.log("Error while changing email information");
        }.bind(this));
    }
  }

  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  componentDidMount() {
    this.getUserData();
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Navigation currentPage="profile" />
        <div className="main-content">
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? (
                <div className="tile" style={{paddingBottom: "5px"}}>
                  <div className="profile-information">
                    <h2>Change your profile information</h2>
                    <div className="success-div" style={{display: "none"}} ref={this.successDiv}>
                      Successfully updated user data.
                    </div>
                    <div className="failed-div" style={{display: "none"}} ref={this.failDiv}>
                      Failed updating user data.
                    </div>
                    <div>
                      <span style={{ display: "block" }}>Username </span>
                      <input
                        type="text"
                        onChange={this.handleChangeUsername}
                        value={this.state.username ? this.state.username : ""}
                      />
                    </div>
                    <br />
                    <div>
                      <span style={{ display: "block" }}>Email</span>
                      <input
                        type="text"
                        onChange={this.handleChangeEmail}
                        value={this.state.email ? this.state.email : ""}
                      />
                    </div>
                    <button
                      className="buttons cta-button"
                      style={{
                        marginTop: "20px"
                      }}
                      onClick={this.updateUserData}
                    >
                      Save
                    </button>
                   

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

export default withAuthentication(ProfileEdit);
