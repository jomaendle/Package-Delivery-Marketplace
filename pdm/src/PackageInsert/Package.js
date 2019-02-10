/*global google*/

import React, { Component } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation';
import Header from "../components/Header";
import Map from "../components/Maps"
import '../App.css';
import { withAuthentication, AuthUserContext } from "../Session";
require('dotenv').config();

export class Package extends Component {

    constructor() {
        super();
        this.state = {
            startLocation: {
                lat: null,
                lng: null
            },
            destination: {
                lat: null,
                lng: null
            }, 
            showSecondMarker: false,
            mapPositionArray: [],
            priority: "",
            price: ""
        }
      //  this.handleMapClick = this.handleMapClick.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.continueToFinalPage = this.continueToFinalPage.bind(this);

        //Create refs
        this.rangeRef = React.createRef();
        this.sizeRef = React.createRef();
        this.weightRef = React.createRef();
        this.commentRef = React.createRef();
        this.priceRef = React.createRef();

        
    }

    componentWillMount() {
       // this.getGeoLocation();
    }

    componentDidMount() {
        this.setState({
            priority: "Priority: Very High",
            price: "Price: " + this.priceRef.current.value + "€"
        })
        
    }

    getDataFromMaps = (data) => {
        this.setState({
            mapPositionArray: data
        })
    }

    clearValues() {
        this.setState({
            startLocation: {
                lat: null,
                lng: null
            },
            destination: {
                lat: null,
                lng: null
            }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.mapPositionArray.length === 2){
            const size = this.sizeRef.current.value;
            const weight = this.weightRef.current.value;
            const priority = this.rangeRef.current.value;
            const comment = this.commentRef.current.value;
            const price = this.priceRef.current.value;
            let res;
    
            let startLocation = {
                lat: this.state.mapPositionArray[0].lat,
                lng: this.state.mapPositionArray[0].lon
            }

            let destination = {
                lat: this.state.mapPositionArray[1].lat,
                lng: this.state.mapPositionArray[1].lon
            }
    
            axios.post('https://us-central1-studienarbeit.cloudfunctions.net/parcel', {
                size,
                weight,
                priority,
                comment,
                price,
                startLocation: startLocation,
                destination: destination
            })
            .then(response => { 
                res = response;
                console.log(startLocation, destination)
                console.log(response)
            })
            .catch(error => {
                console.log(startLocation, destination)
                console.log(error.response)
            });

            let currentPackage = {
                size,
                weight,
                priority,
                comment,
                price
            }

            this.continueToFinalPage(currentPackage, res);
        }else{
            alert("Please select the start and final destination of the package. ")
        }
    }

    redirectToCompletePage(){
        this.props.history.push({
            pathname: '/driver',
            state: { 
                currentLatLng: this.state.currentLatLng
            }
        })
    }

    updatePriorityLabel(e) {
        e.preventDefault();
        let value ="";
        switch (this.rangeRef.current.value) {
            case "1":
                value = "Very low"
                break;
            case "2":
                value = "Low"
                break;
            case "3":
                value = "Normal"
                break;
            case "4":
                value = "High"
                break;
            case "5":
                value = "Very High"
                break;
            default:
                value= ""
                break;
        }
        this.setState({
            priority: "Priority: " +value 
        })
    }

    updatePriceLabel(e) {
        e.preventDefault();
        this.setState({
            price: "Price: " + this.priceRef.current.value + "€"
        })
    }

    continueToFinalPage(currentPackage, res) {
        this.props.history.push({
            pathname: '/final',
            state: { 
                userType: "customer",
                package: currentPackage,
                response: res
            }
        })
    }


    render() {

        return (
            <div className="App">
                <Header />
                <Navigation currentPage="package"/>
                <div className="main-content">
                <AuthUserContext.Consumer>
                    {authUser =>
                        authUser ?
                            <div>
                                <h2>
                        Insert a new package to the marketplace
                    </h2>
                    <div>
                        <Map callbackFromParent={this.getDataFromMaps} />
                        <form onSubmit={this.handleSubmit}>
                            <p  className="p-border">
                                <span style={{fontWeight: 600}}>What's the size of your package?</span>
                                <select name="size" ref={this.sizeRef} className="package-insert-select">
                                    <option value="small">S (35 x 25 x 10 cm)</option>
                                    <option value="medium">M (60 x 30 x 15 cm)</option>
                                    <option value="large">L (120 x 60 x 60 cm)</option>
                                </select>
                            </p>
                            <p className="p-border">
                                <span style={{fontWeight: 600}}>
                                    How heavy is it?
                                </span>
                                <select name="weight" ref={this.weightRef} className="package-insert-select">
                                    <option value="light">Up to 2 Kg</option>
                                    <option value="medium">Up to 5 Kg</option>
                                    <option value="heavy">Up to 10 Kg</option>
                                </select>
                            </p>
                            <div style={{marginTop: "10px"}}>
                                <p className="p-border">
                               <span  style={{fontWeight: 600}}>
                               What priority should it have?
                                </span>  <br/><br/>
                                    <span style={{marginRight: "20px", display: "inline-block", width: "135px"}}>
                                        {this.state.priority}
                                    </span>
                                    <input type="range" ref={this.rangeRef} name="priority"
                                            min="1" max="5" style={{ width: "250px"}}
                                            onChange={(e) => {this.updatePriorityLabel(e)}}
                                    />
                                    
                            </p>
                            <p className="p-border">
                                <span style={{fontWeight: 600}}>
                                    Whats your maximum price?
                                </span> <br/><br/>
                                <span style={{marginRight: "20px", display: "inline-block", width: "135px"}}>
                                        {this.state.price}
                                    </span>
                                    <input type="range" ref={this.priceRef} name="price"
                                            min="1" max="100" style={{ width: "250px"}}
                                            onChange={(e) => {this.updatePriceLabel(e)}}
                                    />
                            </p>
                            </div>  
                            <p className="p-border">
                                <span style={{fontWeight: 600}}>Any Comments?</span>
                                <textarea id="package-comment" name="comment" 
                                className="package-insert-select"
                                ref={this.commentRef}
                                ></textarea>
                            </p>
                            <div id="selected-locations">
                                <div className="speech-bubble">
                                </div>
                                <div style={{lineHeight: "19px"}}>
                                    <span style={{fontWeight: 600}}>Start Location</span> <br/>
                                    {this.state.startLocation.lat ? this.state.startLocation.lat.toFixed(3) : "0"}, {" "} 
                                    {this.state.startLocation.lng ? this.state.startLocation.lng.toFixed(3) : "0"}
                                </div>
                                    <br/>
                                <div style={{lineHeight: "19px"}}>
                                    <span style={{fontWeight: 600}}> Destination </span> <br/>
                                    {this.state.destination.lat ? this.state.destination.lat.toFixed(3) : "0"},  {" "}
                                    {this.state.destination.lng ? this.state.destination.lng.toFixed(3) : "0"}
                                </div>
                            </div>    
                            <div style={{marginTop: "20px"}}>
                                <button className="buttons critical-button" onMouseDown={this.clearValues}>Clear Values</button>
                                <input className="buttons cta-button" type="submit" style={{float: "right"}} value="Submit"/>
                            </div>
                                </form>
                            </div>
                            </div>
                        :  
                            <div>
                                <div className="userNotLoggedIn-label">
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

export default withAuthentication(Package);
