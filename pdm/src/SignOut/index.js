import React from 'react';
import { Link } from "react-router-dom";
import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <Link  to="/">
    <span id="signout-label" onClick={firebase.doSignOut}>
      Sign Out
    </span>
  </Link>
);

export default withFirebase(SignOutButton);