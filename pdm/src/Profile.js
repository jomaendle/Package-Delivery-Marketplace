import React, { Component } from 'react';
import Header from './components/Navigation';
import './App.css';

class Profile extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div id="profile-content">
            <span>
                Username: 
            </span>
            <span>
                Email: 
            </span>
        </div>
      </div>
    );
  }
}

export default Profile;
