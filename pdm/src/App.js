import React, { Component } from 'react';
import Navigation from './components/Navigation';
import Header from "./components/Header";
import './App.css';
import { Link } from "react-router-dom";
import { withAuthentication } from "./Session";


class App extends Component { 

  constructor(){
    super();

    this.state = {
      userToken: null
    }
  }

  componentWillMount(){
    if(this.props.location.state){
      this.setState({
        userToken: this.props.location.state.userToken
      })
    }
  }

  render() {
    return (
        <div className="App">
          <Header />
          <Navigation currentPage="home"/>
          <div className="main-content">
            <h2>Hello Username</h2>
            <p className="home-text">
              On this place, you can either insert packages with a need to deliver or delivering packages on your own. 
            </p>
            <p className="home-text">
              If you go to <Link style={{color: "#4e83c5"}} to="/packages">Packages</Link>, you can view your current packages or add new ones.
            </p>
            <p className="home-text">
            On the <Link style={{color: "#4e83c5"}} to="/driver">Delivery</Link> page, you can view your past drives or start a new delivery.                    
            </p>
            <p className="home-text">
            On the <Link style={{color: "#4e83c5"}} to="/profile">Profile</Link> page, you can see your information and your current rating basend of your deliveries.        
            </p>

          </div>
        </div>
    );
  }
}

export default withAuthentication(App);
