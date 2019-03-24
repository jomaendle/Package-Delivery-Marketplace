import React, { Component } from "react";
import Navigation from "./components/Navigation";
import Header from "./components/Header";
import "./App.css";
import { withAuthentication, AuthUserContext } from "./Session";

export class FinalPage extends Component {
  constructor() {
    super();

    this.state = {
      userType: "",
      package: "",
      response: ""
    };
  }

  componentWillMount() {
    if (this.props.location.state) {
      this.setState({
        userType: this.props.location.state.userType,
        package: this.props.location.state.package,
        success: this.props.location.state.success,
        response: this.props.location.state.response
          ? this.props.location.state.response
          : ""
      });
    }
  }

  render() {
    let data = this.state.contentMessage;
  
    if (this.state.success === true) {
      data = (
        <div>
          <h2>Congrats! Your package was successfully added.</h2>
          <div>
            You can now relax, while we're finding the best driver for your
            delivery.
          </div>
        </div>
      );
    }else if(this.state.success === false){
      data = (
        <div>
          <h2>Something went wrong :(</h2>
          <div>
           We're sorry, but your package couldn't be transmitted to our servers. Please check your internet connection an try again.
          </div>
        </div>
      )
    }
    return (
      <div className="App">
        <Header />
        <Navigation />
        <div className="main-content">
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? (
                <div
                  className="tile"
                  style={{ paddingTop: "24px", textAlign: "center" }}
                >
                  <img
                    style={{ width: "150px" }}
                    alt="Shows a route between two points"
                    src="/assets/distance.png"
                  />
                  {data}
                </div>
              ) : (
                <div className="tile">
                  <div className="userNotLoggedIn-label">
                    Please log in to access this page.
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

export default withAuthentication(FinalPage);
