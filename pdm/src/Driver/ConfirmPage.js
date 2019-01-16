import React, { Component } from 'react';
import Navigation from '../components/Navigation';
import Header from "../components/Header";
import '../App.css';
import { withAuthentication } from "../Session";
require('dotenv').config();

export class ConfirmationPage extends Component {

    constructor() {
        super();
        
        this.state = {
            selectedPackages: [],
            timeAvailable: 0,
            currentLatLng: {
                lat: "",
                lng: ""
            }
        }
        this.ReturnToPreviousPage = this.ReturnToPreviousPage.bind(this);
        this.continueToFinalPage = this.continueToFinalPage.bind(this);
    }

    componentWillMount() {
        this.setState({
            selectedPackages: this.props.location.state.selectedPackages,
            timeAvailable: this.props.location.state.prevState.timeAvailable,
            currentLatLng: this.props.location.state.prevState.currentLatLng
        })

        console.log(this.props.location.state);
    }

    ReturnToPreviousPage() {
        this.props.history.push({
            pathname: '/driver-select-packages',
            state: { 
                selectedPackages: this.state.selectedPackages
            }
          })
    }

    continueToFinalPage() {
        this.props.history.push({
            pathname: '/final',
            state: { 
                userType: "driver",
            }
        })
    }

    render() {

        if(this.state.selectedPackages) {
            return (
                <div className="App">
                    <Header />
                    <Navigation currentPage="delivery"/>
                    <div className="main-content">
                        <h2>
                            Congrats! Check your information and submit 
                        </h2>
                        <div>
                            <p style={{marginBottom: "45px"}}>
                                <span style={{fontWeight: 600}}>
                                    Your available time level is:
                                </span> {this.state.timeAvailable}
                            </p>
                            <p  style={{marginBottom: "45px"}}> 
                                <span style={{fontWeight: 600}}>
                                    Your current position is:
                                </span> {this.state.currentLatLng.lat} , {this.state.currentLatLng.lng}
                            </p>

                            <p>
                                <span style={{fontWeight: 600}}>
                                    You selected the following packages to deliver:
                                </span>
                            </p>
                            { this.state.selectedPackages.map((person, index) => {
                                return(
                                    <div className="listed-packages" key={index} onMouseDown={this.handlePackageClick} >
                                        <span>{person}</span>
                                    </div>
                            )})}
    
                        </div>
                        <button className="buttons" onMouseDown={this.ReturnToPreviousPage}>Back</button>
                        <button className="buttons cta-button" onMouseDown={this.continueToFinalPage} style={{float: "right"}}>Confirm</button>
                    </div>
                </div>
            );
        }else{
            return (
                <div>
                     <div className="App">
                    <Header />
                    <Navigation/>
                    <div className="main-content">
                        <h3>
                            Congrats! Check your information and submit 
                        </h3>
                        <h4>
                        
                        </h4>
                        <div>
    
                        </div>
                        <button className="buttons" onMouseDown={this.ReturnToPreviousPage}>Back</button>
                        <button className="buttons" style={{float: "right"}}>Submit</button>
                    </div>
                </div>
                </div>
            );
        }
    }
}

export default withAuthentication(ConfirmationPage);
