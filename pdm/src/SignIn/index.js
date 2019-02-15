import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import firebase from "firebase"

const SignInPage = () => (
  <div className="App">
    <Header />
    <Navigation />
    <SignInForm />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });

        let token;
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
          // Send token to your backend via HTTPS
          token = idToken;
          console.log(idToken)
          // ...
        }).catch(function(error) {
          // Handle error
        });

        this.props.history.push({
          pathname: '/',
          state: { 
              userToken: token
          }
       })
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
        <div style={{marginTop: "65px"}}>
            <h1>Sign In</h1>
            <form onSubmit={this.onSubmit}>
            <input
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
            />
            <input
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
            />
            <button disabled={isInvalid} type="submit">
                Sign In
            </button>

            {error && <p>{error.message}</p>}
            </form>
        </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };