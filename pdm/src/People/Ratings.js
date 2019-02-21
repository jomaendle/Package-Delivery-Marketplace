import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { withAuthentication, AuthUserContext } from "../Session";
import "../App.css";

class Ratings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drivers: [
        {
          id: 1,
          name: "Alfredo",
          rating: 88
        },
        {
          id: 2,
          name: "Jimmy M.",
          rating: 402
        },
        {
          id: 3,
          name: "Benjamas",
          rating: 1020
        }
      ]
    };
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Navigation currentPage="profile" />
        <div className="main-content">
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? (
                <div className="tile">
                  <h2>Ratings</h2>
                  <h4>This page shows all driver with their current rating.</h4>
                  {this.state.drivers.map((driver, index) => {
                    return (
                      <div key={index} className="ratings-div">
                        {driver.rating}, {driver.name}
                      </div>
                    );
                  })}
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

export default withAuthentication(Ratings);
