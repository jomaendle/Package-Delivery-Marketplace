import React, { Component } from 'react';
import Navigation from './components/Navigation';
import Header from "./components/Header";
import { Link } from "react-router-dom";
import { withAuthentication, AuthUserContext } from "./Session";
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

    this.usernameLabel = React.createRef();
    this.emailLabel = React.createRef();
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
  }


  componentDidMount() {
    this.getUserData();
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Navigation currentPage="profile"/>
        <div className="main-content">
        <AuthUserContext.Consumer>
          {authUser =>
            authUser ? 
            <div>
              <div  className="profile-information">
              <h3 ref={this.usernameLabel}>
                  {this.state.username ? this.state.username : "Username"}
              </h3>
              </div>
              <div  className="profile-information">
                  <span ref={this.emailLabel} >
                    Email: {this.state.email}
                  </span>
              </div>
              <Link to="/profile-edit">Edit Profile</Link>
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

export default withAuthentication(Profile);
