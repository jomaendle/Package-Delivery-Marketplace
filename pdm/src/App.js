import React, { Component } from 'react';
import Navigation from './components/Navigation';
import Header from "./components/Header";
import './App.css';
import { withAuthentication } from "./Session";

class App extends Component {

  render() {
    return (
        <div className="App">
        <Header />
        <Navigation />
        </div>
    );
  }
}

export default withAuthentication(App);
