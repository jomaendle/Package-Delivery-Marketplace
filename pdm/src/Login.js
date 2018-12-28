import React, { Component } from 'react';
import Navigation from './components/Navigation';
import './App.css';
import  { FirebaseContext } from './Firebase';

class Login extends Component {
  render() {
    return (
        <div>
          <Navigation />
          <FirebaseContext.Consumer>
            {firebase => {
              return (
                <div>
                  I've access to Firebase and render something.
                </div>
              );
            }}
          </FirebaseContext.Consumer>
        </div>
    );
  }
}

export default Login;
