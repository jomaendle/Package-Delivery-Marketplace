import React, { Component } from 'react';
import Navigation from './components/Navigation';
import Header from "./components/Header";
import axios from 'axios';
import './App.css';
import { withAuthentication } from "./Session";
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
    }

    componentDidMount() {
        axios.get(`https://jsonplaceholder.typicode.com/users`)
          .then(res => {
            const persons = res.data;
            this.setState({ persons });
          })
        console.log(this.props.location.state.currentLatLng)
    }

    handlePackageClick = (e) => {

        if(!this.state.selectedPackages.includes(e.target.querySelector("span").innerHTML)){
            this.state.selectedPackages.push(e.target.querySelector("span").innerHTML);
            e.target.className = "listed-packages-clicked";
        }
       console.log(this.state);
    }

    ReturnToPreviousPage() {
        this.props.history.push({
            pathname: '/driver',
            state: { 
                currentLatLng: this.state.currentLatLng
            }
          })
    }

    render() {

        return (
            <div className="App">
                <Header />
                <Navigation/>
                <div className="main-content">
                    <h3>
                        Want to deliver packages? 
                    </h3>
                    <h4>
                    Select one or more packages to proceed.
                    </h4>
                    <div>
                        { this.state.persons.map((person, index) => {
                            return(
                                <div className="listed-packages" key={index} onClick={this.handlePackageClick} >
                                    <span>{person.name}</span>
                                </div>
                        )})}

                    </div>
                    <button className="buttons" onClick={this.ReturnToPreviousPage}>Back</button>
                    <button className="buttons">Continue</button>
                </div>
            </div>
        );
    }
}

export default withAuthentication(Package);
