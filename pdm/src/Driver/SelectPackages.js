import React, { Component } from 'react';
import Navigation from '../components/Navigation';
import Header from "../components/Header";
import axios from 'axios';
import '../App.css';
import { withAuthentication } from "../Session";
require('dotenv').config();

export class Package extends Component {

    constructor() {
        super();
        
        this.state = {
            persons: [],
            selectedPackages: []
        }
        this.handlePackageClick = this.handlePackageClick.bind(this);
        this.ReturnToPreviousPage = this.ReturnToPreviousPage.bind(this);
        this.ContinueToConfirmPage = this.ContinueToConfirmPage.bind(this);
    }

    componentWillMount() {
        if(this.props.location.state.selectedPackages){
            this.setState({
                selectedPackages: this.props.location.state.selectedPackages
            })
        }
    }

    componentDidMount() {

        axios.post(`https://us-central1-studienarbeit.cloudfunctions.net/parcel`, {
            action: "list",
            parcel_id: ""
        })
          .then(res => {
              console.log(res.data.list)
            const persons = res.data;
            if(res.data.list){
                this.setState({ persons });
            }
          })
       
    }

    handlePackageClick = (e) => {
        if(!this.state.selectedPackages.includes(e.target.querySelector("span").innerHTML)){
            this.state.selectedPackages.push(e.target.querySelector("span").innerHTML);
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
                    <h2>
                     Select one or more packages to proceed.
                    </h2>
                    <div>
                        { this.state.persons.length !== 0 ? this.state.persons.map((person, index) => {
                            return(
                                <div className="listed-packages" key={index} onMouseDown={this.handlePackageClick} >
                                    <span>{person.name}</span>
                                </div>
                        )}):
                        <div style={{marginBottom: "25px"}}>
                            There are no packages available right now. Please check later again.
                        </div>}

                    </div>
                    <button className="buttons" onMouseDown={this.ReturnToPreviousPage}>Back</button>
                    <button className="buttons cta-button" onMouseDown={this.ContinueToConfirmPage} style={{float: "right"}}>Continue</button>
                </div>
            </div>
        );
    }
}

export default withAuthentication(Package);
