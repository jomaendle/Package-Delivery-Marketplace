import React, { Component } from 'react';
import Header from './components/Header';
import './App.css';

class Home extends Component {
  render() {
    return (
      <div className="App">
        <Header />

        Hello, signed in User
      </div>
    );
  }
}

export default Home;
