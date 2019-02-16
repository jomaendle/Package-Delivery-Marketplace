import React, { Component } from "react";
import Navigation from "./components/Navigation";
import Header from "./components/Header";
import "./App.css";
import { Link } from "react-router-dom";
import { withAuthentication, AuthUserContext } from "./Session";

class App extends Component {
  _username = null;
  _iconSize = "60px";
  _iconMarginRight="30px";

  constructor() {
    super();

    this.state = {
      userToken: null,
      username: ""
    };

    
  }

  componentWillMount() {
    if (this.props.location.state) {
      this.setState({
        userToken: this.props.location.state.userToken
      });
    }
    
  }

  componentDidMount(){
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Navigation currentPage="home" />
        <div className="main-content">
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? 
              (
                <div className="tile" >
                  <div style={{display: "none"}}>
                  {this._username ? "" : this._username = authUser.displayName }
                  </div>
                  
                  <h2 style={{paddingLeft: "10px"}}>Hello {this._username ? this._username + "," : "User,"}</h2>
                  <p className="home-text" style={{marginTop: "-10px"}}>
                    On this place, you can either insert packages with a need to
                    deliver or delivering packages on your own.
                    <br/>
                    <br/>
                    <img style={{
                    width: this._iconSize,
                    float: "left",
                    marginRight: this._iconMarginRight,
                    }} alt="Shows an icon of a person" src="/assets/packing.png"/>
                    If you go to{" "}
                    <Link style={{ color: "#4e83c5", fontFamily: "'Muli', sans-serif" }} to="/packages">
                      Packages
                    </Link>
                    , you can view your current packages or add new ones.
                  </p>
                  <p className="home-text">
                  <img style={{
                    width: this._iconSize,
                    float: "left",
                    marginRight: this._iconMarginRight,
                  }} alt="Shows an icon of a person" src="/assets/transport.png"/>
                    On the{" "}
                    <Link style={{ color: "#4e83c5", fontFamily: "'Muli', sans-serif" }} to="/driver">
                      Delivery
                    </Link>{" "}
                    page, you can view your past drives or start a new delivery.
                  </p>
                  <p className="home-text">
                  <img style={{
                    width: this._iconSize,
                    float: "left",
                    marginRight: this._iconMarginRight,
                  }} alt="Shows an icon of a person" src="/assets/man.png"/>
                    On the{" "}
                    <Link style={{ color: "#4e83c5" , fontFamily: "'Muli', sans-serif"}} to="/profile">
                      Profile
                    </Link>{" "}
                    page, you can see your information and your current rating
                    basend of your deliveries.
                  </p>
                </div>
              ) : (
                <div className="tile">
                  <div className="userNotLoggedIn-label">
                    Welcome to the Package Delivery Marketplace PDM.
                  </div>
                </div>
              )
            }
          </AuthUserContext.Consumer>
        </div>
      </div>
    );
  }
}

export default withAuthentication(App);
