import React from 'react';
import '../App.css';
import SignOutButton from "../SignOut";
import { Link } from "react-router-dom";
import { AuthUserContext } from "../Session";

const NavigationAuth = () => (
  <div>
    <ul  id="navigation-bar">
      <li>
        <Link className="navigation-links" to={"/"}> Home </Link>
      </li>
      <li>
        <Link className="navigation-links" to={"/profile"}> Profile </Link>
      </li>
      <li>
        <Link to={"/new-package"}> Insert new Package </Link>
      </li>
      <li>
      <Link to={"/driver"}> Become a Driver </Link>
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

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />}
    </AuthUserContext.Consumer>
  </div>
);

export default Navigation;