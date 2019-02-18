import React, { Component } from 'react';
import '../App.css';


class Header extends Component {

  render() {
    return (
      <div id="Header">
        <div>
          <img id="mobile-menu-logo" alt="Shows a route between two points" src="/assets/menu.png"/>
        </div>
        <h2 id="Header-label"> Package Delivery Marketplace </h2>
      </div>
    );
  }
}

export default Header;