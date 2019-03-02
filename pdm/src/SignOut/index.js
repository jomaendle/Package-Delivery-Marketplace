import React from 'react';
import { Link } from "react-router-dom";
import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <Link  to="/">
    <span id="signout-label" onClick={firebase.doSignOut}>
      Sign Out
      <img className="menu-icons" style={{width: "18px", right: "2px"}} alt="Shows an icon of a home" src="/assets/sign-out.png"/>
    </span>
  </Link>
);

export default withFirebase(SignOutButton);