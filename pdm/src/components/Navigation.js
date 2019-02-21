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
            ?  <Link className="navigation-links" to={"/"}> Home </Link>
            :  <Link to={"/"}> Home </Link>}
          </li>
          <li>
          {this.state.currentPage==="profile" 
            ?  <Link className="navigation-links" to={"/profile"}> Profile </Link>
            :  <Link  to={"/profile"}> Profile </Link>}
          </li>
         <li>
          {this.state.currentPage==="package" 
          ? <Link className="navigation-links" to={"/packages"}> My Packages </Link>
          :  <Link to={"/packages"}> My Packages </Link>}
          </li>
      	  <li>
            {this.state.currentPage==="delivery" 
              ? <Link className="navigation-links" to={"/drives"}>My Deliveries </Link>
              : <Link  to={"/drives"}> My Deliveries </Link>
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
          {this.state.currentPage==="home" 
            ?  <Link className="navigation-links" to={"/"}> Home </Link>
            :  <Link to={"/"}> Home </Link>}
          </li>
          <li>
          {this.state.currentPage==="login" 
            ?  <Link className="navigation-links" to={"/login"}> Sign In </Link>
            :  <Link to={"/login"}> Sign In </Link>}
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

export default Navigation;