import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import "../App.css";
import { sendPostRequest } from "../API/Requests";
import firebase from "firebase";
import { Link } from "react-router-dom";
import { withAuthentication, AuthUserContext } from "../Session";

export class MyDrives extends Component {
    constructor() {
        super();

        this.state = {
            drives: [],
            userToken: null,
            loading: true
        };

        this.getUserDrives = this.getUserDrives.bind(this);
        this.getUserToken = this.getUserToken.bind(this);
    }

    componentWillMount() {
        this.getUserToken();
        setTimeout(
            function() {
                this.setState({
                    loading: false
                });
            }.bind(this),
            4000
        );
    }

    componentDidMount() {
        document.title = "My Deliveries - Package Delivery Marketplace";
    }

    sortDrivesByTime() {
        let resultArray = this.state.drives;
        resultArray.sort(function(a, b) {
            var dateA = new Date(a.time_created);
            var dateB = new Date(b.time_created);

            if (dateA < dateB) {
                return 1;
            }
            if (dateA > dateB) {
                return -1;
            }
            return 0;
        });

        this.setState({
            drives: resultArray
        });
    }

    async getUserDrives() {
        //Wrap data into object
        let data = JSON.stringify({
            user_token: this.state.userToken
        });

        //Send HTTP Post request
        let response = await sendPostRequest("pd_job_history", data);
        if (response !== null) {
            console.log(response);
            this.setState({
                drives: response.data.jobs,
                loading: false
            });
            this.sortDrivesByTime();
        } else {
            this.setState({
                loading: false
            });
            console.log(response);
            console.log("Error fetching user drives");
        }
    }

    getUserToken() {
        if (firebase.auth().currentUser) {
            firebase
                .auth()
                .currentUser.getIdToken(/* forceRefresh */ true)
                .then(
                    function(idToken) {
                        this.setState(
                            {
                                userToken: idToken
                            },
                            this.getUserDrives
                        );
                    }.bind(this)
                )
                .catch(function(error) {
                    // Handle error
                });
        }
    }

    showPackageDetail = (e, p) => {
        e.preventDefault();
        this.props.history.push({
            pathname: "/package-details",
            state: {
                currentPackageID: p,
                userToken: this.state.userToken
            }
        });
    };

    diffHours = date => {
        let dt2 = new Date();
        let dt1 = new Date(date);
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60 * 60;
        if (Math.abs(Math.round(diff)) >= 24) {
            return Math.round(Math.abs(Math.round(diff)) / 24) + " d ago";
        } else {
            return Math.abs(Math.round(diff)) + " h ago";
        }
    };

    render() {
        return (
            <div className="App">
                <Header />
                <Navigation currentPage="delivery" />
                <div className="main-content">
                    <AuthUserContext.Consumer>
                        {authUser =>
                            authUser ? (
                                <div className="tile">
                                    <div id="my-packages-container">
                                        <h2>Manage your deliveries.</h2>
                                        {this.state.drives.length > 0 ? (
                                            this.state.drives.map(
                                                (p, index) => {
                                                    return (
                                                        <div
                                                            className="listed-packages"
                                                            key={index}>
                                                            <span
                                                                id="packages-table-heading"
                                                                className="packages-table">
                                                                Job {index + 1}
                                                            </span>
                                                            <div className="packages-table">
                                                                {p.selected_parcels.map(
                                                                    (key,index) => {
                                                                        return (
                                                                            <div
                                                                                key={index}
                                                                                onClick={e =>this.showPackageDetail(e,key)}
                                                                            >
                                                                                <img
                                                                                    style={{
                                                                                        width:
                                                                                            "24px",
                                                                                        top:
                                                                                            "8px",
                                                                                        position:
                                                                                            "relative",
                                                                                        marginRight:
                                                                                            "8px"
                                                                                    }}
                                                                                    alt="Shows an a packaging box."
                                                                                    src="/assets/box.png"
                                                                                />
                                                                                <span
                                                                                    className="parcel-link"
                                                                                    style={{
                                                                                        color:
                                                                                            "rgb(46, 52, 63)"
                                                                                    }}
                                                                                >
                                                                                    <b>
                                                                                        {" "}
                                                                                        {
                                                                                            key
                                                                                        }{" "}
                                                                                    </b>
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                            <span
                                                                className="packages-table"
                                                                style={{position:"absolute",top: "10px",right: "5px"}}>
                                                                <img
                                                                    style={{
                                                                        width:"18px",
                                                                        top:"4px",
                                                                        position:"relative",
                                                                        marginRight:"8px"
                                                                    }}
                                                                    alt="Shows an a packaging box."
                                                                    src="/assets/past.png"
                                                                />
                                                                {this.diffHours(p.time_created)}
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                            )
                                        ) : (
                                            <div id="no-available-div">
                                                {this.state.loading ? (
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        No deliveries available.{" "}
                                                        <br />
                                                        You can start a new one
                                                        by clicking{" "}
                                                        <Link
                                                            style={{
                                                                color: "#4e83c5"
                                                            }}
                                                            to="/driver"
                                                        >
                                                            here
                                                        </Link>
                                                        .
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <Link to="/driver">
                                            <button
                                                id="add-package-button"
                                                className="buttons cta-button"
                                            >
                                                Add Delivery
                                            </button>
                                        </Link>
                                    </div>
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

export default withAuthentication(MyDrives);
