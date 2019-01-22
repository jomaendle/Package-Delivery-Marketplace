import React from 'react';
import '../App.css';
import SignOutButton from "../SignOut";
import { Link } from "react-router-dom";
import { AuthUserContext } from "../Session";

 class Navigation extends React.Component{

  constructor() {
    super();
    this.state = {
        currentPage: ""
    }

  }
  
  componentWillMount() {
    this.setState({
      currentPage: this.props.currentPage
    })
  }
  render() {

    const NavigationAuth = (props) => (
      <div>
        <ul  id="navigation-bar">
          <li>
            {this.state.currentPage==="home" 
            ?  <Link className="navigation-links" style={{borderBottom: "solid", paddingBottom: "3px"}} to={"/"}> Home </Link>
            :  <Link className="navigation-links" to={"/"}> Home </Link>}
          </li>
          <li>
          {this.state.currentPage==="profile" 
            ?  <Link className="navigation-links" style={{borderBottom: "solid", paddingBottom: "3px"}} to={"/profile"}> Profile </Link>
            :  <Link className="navigation-links" to={"/profile"}> Profile </Link>}
          </li>
         <li>
          {this.state.currentPage==="package" 
          ? <Link className="navigation-links" style={{borderBottom: "solid", paddingBottom: "3px"}} to={"/packages"}> My Packages </Link>
          :  <Link className="navigation-links" to={"/packages"}> My Packages </Link>}
          </li>
      	  <li>
            {this.state.currentPage==="delivery" 
              ? <Link className="navigation-links" style={{borderBottom: "solid", paddingBottom: "3px"}} to={"/driver"}>Delivery </Link>
              : <Link className="navigation-links" to={"/driver"}> Delivery </Link>
            }
          </li>
          <li>
            <SignOutButton />
          </li>
        </ul>
      </div>
    );
    
    const NavigationNonAuth = () => (
      <div>
        <ul id="navigation-bar">
          <li>
            <Link className="navigation-links" to={"/"}> Home </Link>
          </li>
          <li>
            <Link className="navigation-links" to={"/login"}> Sign In </Link>
          </li>
        </ul>
    
      </div>
    );

    return(
      <div>
        <AuthUserContext.Consumer>
          {authUser =>
            authUser ? <NavigationAuth currentPage={this.state.currentPage} /> : <NavigationNonAuth currentPage={this.state.currentPage} />}
        </AuthUserContext.Consumer>
      </div>
    )
  }
}

let currentPage;



export default Navigation;