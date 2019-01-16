import React, { Component } from 'react';
import Navigation from './components/Navigation';
import Header from "./components/Header";
import './App.css';
//import ConfirmImage from "/assets/distance.png"
import { withAuthentication } from "./Session";

export class FinalPage extends Component {

    constructor() {
        super();
        
        this.state = {
            userType: "",
            package: ""
        }
    }

    componentWillMount() {
        this.setState({
            userType: this.props.location.state.userType,
            package: this.props.location.state.package
        })
        console.log(this.props.location.state.package)
    }

    render() {
        let data;
        if(this.state.userType === "driver") {
            data = (
                <div>
                    <h2>
                        Congrats! 
                    </h2>
                </div>
            )
        }else if(this.state.userType ==="customer"){
            data=(
                <div>
                    <h2>
                        Congrats! Your package was successfully added.
                    </h2>
                    <div>
                        You can now relax, while we're finding the best driver for your delivery.
                    </div>
                </div>
            )
        }
        return (
            <div className="App">
                <Header />
                <Navigation/>
                <div className="main-content">
                <div style={{paddingTop: "24px", textAlign: "center"}}>
                    <img style={{width: "150px"}} alt="Shows a route between two points" src="/assets/distance.png"/>
                    {data}
                </div>
                </div>
            </div>
        );
    }
}

export default withAuthentication(FinalPage);
