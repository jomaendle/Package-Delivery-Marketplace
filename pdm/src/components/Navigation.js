import React from 'react';
import '../App.css';
import SignOutButton from "../SignOut";
import { Link } from "react-router-dom";

const NavigationAuth = () => (
  <div>
    <ul  id="navigation-bar">
      <li>
        <Link to={"/"}> Home </Link>
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

const Navigation = ({ authUser }) => (
  <div>
    {authUser ? <NavigationAuth /> : <NavigationNonAuth />}
  </div>
);

export default Navigation;