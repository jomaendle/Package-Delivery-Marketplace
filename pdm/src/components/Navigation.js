import React from 'react';
import '../App.css';
import SignOutButton from "../SignOut";
import { Link } from "react-router-dom";
import { AuthUserContext } from "../Session";
import { auth } from 'firebase';

const NavigationAuth = () => (
  <div>
    <ul  id="navigation-bar">
      <li>
        <Link to={"/"}> Home </Link>
      </li>
      <li>
        <Link to={"/profile"}> Profile </Link>
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
        <Link to={"/"}> Home </Link>
      </li>
      <li>
        <Link to={"/login"}> Sign In </Link>
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