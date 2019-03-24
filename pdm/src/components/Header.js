import React, { Component } from 'react';
import Navigation from "./Navigation";
import '../App.css';


class Header extends Component {
  _isMobileMenuShown = false;

  constructor(){
    super();

    this.mobileMenuRef = React.createRef();
  }

  showMenu = (e) => {
    if(this._isMobileMenuShown === false){
      this.mobileMenuRef.current.style.display = "block";

      this.mobileMenuRef.current.classList.add("mobile-menu-visible")
      this._isMobileMenuShown = true;
    }else {
      this.mobileMenuRef.current.style.display = "none";
      this._isMobileMenuShown = false;
    }
  }

  render() {
    return (
      <div id="Header">
        <div>
          <img id="mobile-menu-logo" alt="Shows a route between two points" src="/assets/menu.png" onClick={e => this.showMenu(e)}/>
          <div ref={this.mobileMenuRef} id="mobile-menu">
            <Navigation />
          </div>
        </div>
        <h2 id="Header-label"> Package Delivery Marketplace </h2>
      </div>
    );
  }
}

export default Header;