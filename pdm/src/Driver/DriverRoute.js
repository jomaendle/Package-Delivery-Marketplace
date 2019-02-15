import React, { Component } from 'react';
import Navigation from '../components/Navigation';
import Header from "../components/Header";
import '../App.css';
import Map from "../components/Maps"
import { withAuthentication } from "../Session";
import { AuthUserContext } from "../Session";
require('dotenv').config();

export class Driver extends Component {

    constructor() {
        super();
        
        this.state = {
            startLocation: {
                lat: 48.577670, 
                lng: 9.265834
            },
            destination: {
                lat: 48.558917, 
                lng: 9.211809,
            },
            time: 0,
            userToken: null
        }

        this.pickedUpButton = React.createRef();
        this.submittedButton = React.createRef();
    }

    componentWillMount() {
        //Get start location and destination
        if(this.props.location.state){
            this.setState({
              userToken: this.props.location.state.userToken
            })
        }
    }

    componentDidMount(){
        //this.submittedButton.disabled = true;
    }

    handleSubmit = (e) => {
        this.props.history.push({
            pathname: '/driver-select-packages',
            state: { 
                currentLatLng: this.state.currentLatLng,
                timeAvailable: this.state.time}
          })
    }   


    render() {
       
        return (
            <div className="App">
                <Header />
                <Navigation currentPage="delivery" />
                <div className="main-content">
                    <AuthUserContext.Consumer>
                        {authUser =>
                            authUser ? 
                            <div>
                                <h2>
                                    Here's your route!
                                </h2>
                               <Map 
                                    allowMultipleClicks="false"
                                    showAutoCompleteBar="false"
                                    startLocation={this.state.startLocation}
                                    destination={this.state.destination} 
                                    calculateRoute="true"/>

                                <button className="buttons" ref={this.pickedUpButton}>Picked Up</button>
                                <button className="buttons cta-button" ref={this.submittedButton} style={{float: "right"}}>Submitted</button>
                                
                            </div>
                            : 
                            <div>
                                <div className="userNotLoggedInlabel">
                                    Please log in to access this page.
                                </div>
                            </div>
                            }
                    </AuthUserContext.Consumer>
                    </div>
            </div>
        );
    }
}

export default withAuthentication(Driver);
