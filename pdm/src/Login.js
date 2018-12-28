import React, { Component } from 'react';
import Header from './components/Header';
import './App.css';
import  { FirebaseContext } from './Firebase';

class Login extends Component {
  render() {
    return (
        <div>
          <Header />
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
