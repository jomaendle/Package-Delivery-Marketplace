import React from 'react';
import '../App.css';
import SignOutButton from "../SignOut";
import { Link } from "react-router-dom";
import { AuthUserContext } from "../Session";

 class Navigation extends React.Component{
   _iconSize = "18px";

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
            ?  <Link className="navigation-links" to={"/"}> 
              Home 
              <img className="menu-icons" style={{width: this._iconSize}} alt="Shows an icon of a home" src="/assets/home.png"/>
              </Link>
            :  <Link to={"/"}> 
                Home 
                <img className="menu-icons" style={{width: this._iconSize}} alt="Shows an icon of a home" src="/assets/home.png"/>
              </Link>}
          </li>
          <li>
          {this.state.currentPage==="profile" 
            ?  <Link className="navigation-links" to={"/profile"}> 
                Profile 
                <img className="menu-icons" style={{width: this._iconSize}} alt="Shows an icon of a person" src="/assets/avatar_2.png"/>
                </Link>
            :  <Link  to={"/profile"}> 
                Profile 
                <img className="menu-icons" style={{width: this._iconSize}} alt="Shows an icon of a person" src="/assets/avatar_2.png"/>
                </Link>}
          </li>
         <li>
          {this.state.currentPage==="package" 
          ? <Link className="navigation-links" to={"/packages"}> 
              My Packages 
              <img className="menu-icons" style={{width: this._iconSize, top:"4px"}} alt="Shows an icon of a package" src="/assets/box.png"/>
              </Link>
          :  <Link to={"/packages"}> 
              My Packages 
              <img className="menu-icons" style={{width: this._iconSize, top:"4px"}} alt="Shows an icon of a package" src="/assets/box.png"/>
              </Link>}
          </li>
      	  <li>
            {this.state.currentPage==="delivery" 
              ? <Link className="navigation-links" to={"/drives"}>
                My Deliveries 
                <img className="menu-icons" style={{width: this._iconSize, top:"4px"}} alt="Shows an icon of a truck" src="/assets/truck.png"/>
                </Link>
              : <Link  to={"/drives"}> 
                My Deliveries 
                <img className="menu-icons" style={{width: this._iconSize, top:"4px"}} alt="Shows an icon of a truck" src="/assets/truck.png"/>
                </Link>
            }
          </li>
          <li>
            {this.state.currentPage==="ratings" 
              ? <Link className="navigation-links" to={"/ratings"}>
                Ratings
                <img className="menu-icons" style={{width: this._iconSize, top:"3px"}} alt="Shows an icon of a rating star" src="/assets/star.png"/>
                </Link>
              : <Link  to={"/ratings"}> 
                Ratings 
                <img className="menu-icons" style={{width: this._iconSize, top:"3px"}} alt="Shows an icon of a rating star" src="/assets/star.png"/>
                </Link>
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
            ?  <Link className="navigation-links" to={"/"}> 
               Home 
              <img className="menu-icons" style={{width: this._iconSize}} alt="Shows an icon of a home" src="/assets/home.png"/>
             </Link>
            :  <Link to={"/"}> 
               Home 
              <img className="menu-icons" style={{width: this._iconSize}} alt="Shows an icon of a home" src="/assets/home.png"/>
            </Link>}
          </li>
          <li>
          {this.state.currentPage==="login" 
            ?  <Link className="navigation-links" to={"/login"}> 
              Sign In 
              <img className="menu-icons" style={{width: this._iconSize}} alt="Shows an icon of a home" src="/assets/sign-in.png"/>
              </Link>
            :  <Link to={"/login"}> 
                Sign In 
                <img className="menu-icons" style={{width: this._iconSize}} alt="Shows an icon of a home" src="/assets/sign-in.png"/>
                </Link>}
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