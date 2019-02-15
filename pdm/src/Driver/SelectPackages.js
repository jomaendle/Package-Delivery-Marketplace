import React, { Component } from 'react';
import Navigation from '../components/Navigation';
import Header from "../components/Header";
import axios from 'axios';
import '../App.css';
import { withAuthentication, AuthUserContext } from "../Session";
require('dotenv').config();

export class Package extends Component {

    constructor() {
        super();
        
        this.state = {
            packages: [
                {
                    parcel_id: 1,
                    parcel_status: "home", 
                    title: "P1",
                    time_created: "Tue, 22 Jan 2019 05:42:10 GMT"
                },
                {
                    parcel_id: 2,
                    parcel_status: "home", 
                    title: "P2",
                    time_created: "Tue, 22 Jan 2019 08:22:10 GMT"
                }
            ],
            selectedPackages: [],
            userToken: null
        }
        this.handlePackageClick = this.handlePackageClick.bind(this);
        this.ReturnToPreviousPage = this.ReturnToPreviousPage.bind(this);
        this.ContinueToConfirmPage = this.ContinueToConfirmPage.bind(this);

        let selectedPackages = [];
    }

    componentWillMount() {
        // API Call to fetch the parcels which fit for the driver
        axios.get('https://us-central1-studienarbeit.cloudfunctions.net/parceldriver', {
            params: {
                driver_position: 'test',
                radius: ""
            }
          }).then(response => {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });

          if(this.props.location.state){
            this.setState({
              userToken: this.props.location.state.userToken
            })
          }
    }

    handlePackageClick = (e) => {
        //Get all spans from click event
        let allSpans = e.target.querySelectorAll("span");
        let list = [];

        //Catch innerHTML Information from spans
        allSpans.forEach(element => {
            list.push(element.innerHTML);
        });

        let selectedPackage;
        if(this.state.selectedPackages){
            if(!this.state.selectedPackages.includes(list[0].innerHTML) && list !== []){
                //Create new package object to pass it to confirmation page
                selectedPackage = {
                    parcel_id: list[0],
                    parcel_status: list[1], 
                    title: list[2],
                    time_created: list[3]
                }
    
                //Add new package to currently selected packages.
                this.state.selectedPackages.push(selectedPackage);
                e.target.className = "listed-packages-clicked";
            }
        }else{
            //Create new package object to pass it to confirmation page
            selectedPackage = {
                parcel_id: list[0],
                parcel_status: list[1], 
                title: list[2],
                time_created: list[3]
            }

            //Add new package to currently selected packages.
            this.state.selectedPackages.push(selectedPackage);
            e.target.className = "listed-packages-clicked";
        }
    }

    ReturnToPreviousPage() {
        this.props.history.push({
            pathname: '/driver',
            state: { 
                currentLatLng: this.state.currentLatLng
            }
          })
    }

    ContinueToConfirmPage(){
        if(this.state.selectedPackages.length === 0){
            alert("Select at least one package")
        }else{
            this.props.history.push({
                pathname: '/driver-confirm',
                state: { 
                    prevState: this.props.location.state,
                    selectedPackages: this.state.selectedPackages
                }
            })
        }
    }

    render() {

        return (
            <div className="App">
                <Header />
                <Navigation currentPage="delivery"/>
                <div className="main-content">
                <AuthUserContext.Consumer>
                    {authUser =>
                        authUser ? 
                        <div>
                            <h2>
                            Select one or more packages to proceed.
                            </h2>
                            <div>
                                { this.state.packages.length !== 0 ? this.state.packages.map((p, index) => {
                                    return(
                                        <div className="listed-packages" key={index} onMouseDown={this.handlePackageClick} >
                                            <span className="packages-table">{p.parcel_id}</span>
                                            <span className="packages-table">{p.parcel_status}</span>
                                            <span className="packages-table">{p.title}</span>
                                            <span className="packages-table">{p.time_created}</span>
                                        </div>
                                )}):
                                <div style={{marginBottom: "25px"}}>
                                    There are no packages available right now. Please check later again.
                                </div>}

                            </div>
                            <button className="buttons" onMouseDown={this.ReturnToPreviousPage}>Back</button>
                            <button className="buttons cta-button" onMouseDown={this.ContinueToConfirmPage} style={{float: "right"}}>Continue</button>
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
