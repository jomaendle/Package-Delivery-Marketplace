import React, { Component } from 'react';
import Navigation from './components/Navigation';
import Header from "./components/Header";
import { withAuthentication } from "./Session";
import './App.css';


class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userID: null,
      username: "",
      email: "",
      phototURL: null
    };
  }

  getUserData() {
    var user = this.props.firebase.auth.currentUser;
    if (user != null) {
      this.setState({
        userID: user.uid,
        username: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      })
     /* console.log(user.uid);
      user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
      });*/
    }
  }

  componentDidMount() {
    this.getUserData();
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Navigation />
        <div id="profile-content">
            <span>
                Username: {this.state.username}
            </span>
            <br/>
            <span>
                Email: {this.state.email}
            </span>
        </div>
      </div>
    );
  }
}

export default withAuthentication(Profile);
