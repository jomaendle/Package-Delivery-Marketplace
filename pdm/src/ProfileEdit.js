import React, { Component } from 'react';
import Navigation from './components/Navigation';
import Header from "./components/Header";
import { withAuthentication, AuthUserContext } from "./Session";
import './App.css';


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
  }

  getUserData() {
    var user = this.props.firebase.auth.currentUser;
    if (user != null) {
        console.log(user.uid)
        this.setState({
            userID: user.uid,
            username: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        }, 
        this.showUserData);
    }
  }

  updateUserData() {
    var user = this.props.firebase.auth.currentUser;
    if(user != null){
        user.updateProfile({
            displayName: this.state.username
          }).then(function() {
            // Update successful.
          }).catch(function(error) {
            // An error happened.
            console.log("Error while changing profile information")
          });
          user.updateEmail(this.state.email).then(function() {
            // Update successful.
          }).catch(function(error) {
            // An error happened.
            console.log("Error while changing email information")
          });
    }
  }

  showUserData() {
    let usernameInput = this.refs.usernameInput;
    let emailInput = this.refs.emailInput;

    if(this.state.userID != null){
        usernameInput.value = this.state.username;
        emailInput.value = this.state.email;
    }
  } 

  handleChangeUsername(event) {
      this.setState({username: event.target.value});
  }

  handleChangeEmail(event) {
    this.setState({email: event.target.value});
  }

  componentDidMount() {
    this.getUserData();
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Navigation />
        <div className="main-content">
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? 
                <div>
                  <span>
                Username: 
                  </span>
                  <input type="text" ref="usernameInput" onChange={this.handleChangeUsername}></input>
                  <br/>
                  <span>
                      Email:
                  </span>
                  <input type="text" ref="emailInput" onChange={this.handleChangeEmail}></input>
                  <button onClick={this.updateUserData}>Save</button>
                </div>
              : 
              <div className="userNotLoggedIn-label">
                  Please log in to access this page.
              </div> 
              }
          </AuthUserContext.Consumer>
            
        </div>
      </div>
    );
  }
}

export default withAuthentication(ProfileEdit);
