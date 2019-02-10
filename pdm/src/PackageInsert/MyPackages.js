import React, { Component } from 'react';
import Navigation from '../components/Navigation';
import Header from "../components/Header";
import '../App.css';
import { Link } from "react-router-dom";
import { withAuthentication, AuthUserContext } from "../Session";

export class MyPackages extends Component {

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
                    parcel_status: "ready", 
                    title: "P2",
                    time_created: "Tue, 22 Jan 2019 08:22:10 GMT"
                }
            ]
        }

        this.removePackage = this.removePackage.bind(this);
    }

    removePackage(e, p_id) {
        if(this.state.packages.length > 0) {
            e.preventDefault();
            e.target.parentElement.classList.add("hidden");
            setTimeout(function(){ 
                let filteredArray = this.state.packages.filter(item => item.parcel_id !== p_id)
                this.setState({packages: filteredArray}); 
            }.bind(this), 1150);
            
        }
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
                        <div id="my-packages-container">
                            <h2>
                                Manage your packages.
                            </h2>
                            <Link to="/new-package">
                                <button className="buttons cta-button" style={{position: "absolute", top: 0, right: 0, marginRight: 0}}>
                                    Add Package
                                </button>
                            </Link>

                            {this.state.packages.map((p, index) => {
                                    return(
                                        <div className="listed-packages" key={p.parcel_id} onClick={e => this.removePackage(e, p.parcel_id)}>
                                            <span className="packages-table">{p.parcel_id}</span>
                                            <span className="packages-table">{p.parcel_status}</span>
                                            <span className="packages-table">{p.title}</span>
                                            <span className="packages-table">{p.time_created}</span>
                                                
                                            <input 
                                            alt="" 
                                            className="delete-package-button" 
                                            src="/assets/delete-button.png" 
                                            type="image" />
                                        </div>
                            )})}
                        </div>
                        : 
                        <div className="userNotLoggedIn-label">
                            Please log in to access this page.
                        </div>  
                        }
                </AuthUserContext.Consumer>
                    
                </div>
            </div>
        );
    }
}

export default withAuthentication(MyPackages);
