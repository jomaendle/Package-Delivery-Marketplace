import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import Header from "../components/Header";
import { compose } from "recompose";
import Navigation from "../components/Navigation";

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

const SignUpPage = () => (
  <div className="App">
    <Header />
    <Navigation currentPage="login" />
    <SignUpForm />
  </div>
);

class SignUpFormBase extends Component {
  constructor(props) {
    super();

    this.state = { ...INITIAL_STATE };

    this.submitButton = React.createRef();
  }

  componentDidMount() {
    document.title = "Sign Up - Package Delivery Marketplace"
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
      this.props.firebase
        .doCreateUserWithEmailAndPassword(email, passwordOne)
        .then(authUser =>
          function() {
            return this.props.firebase.user(authUser.user.uid).set({
              username,
              email
            });
          }.bind(this)
        )
        .then(() => {
          this.setState({ ...INITIAL_STATE });
          this.props.history.push("/login");
        })
        .catch(error => {
          this.setState({ error });
        });
      event.preventDefault();
  };


  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    if(this.submitButton.current.disabled){
      this.submitButton.current.className = "button-disabled"
    }else{
      this.submitButton.current.className = "buttons"
    }
  };

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";

    return (
      <div className="App">
        <div className="main-content">
          <div className="tile">
          <h1 style={{
              textAlign: "center",
              marginBottom: "40px"
            }}>Sign Up</h1>
            <form onSubmit={this.onSubmit}>
              <input
                name="username"
                className="sign-up-form"
                value={username}
                onChange={this.onChange}
                type="text"
                placeholder="Full Name"
              />
              <br/>
              <input
                name="email"
                value={email}
                className="sign-up-form"
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
              />
              <br/>
              <input
                name="passwordOne"
                value={passwordOne}
                className="sign-up-form"
                onChange={this.onChange}
                type="password"
                placeholder="Password"
              />
              <br/>
              <input
                name="passwordTwo"
                value={passwordTwo}
                className="sign-up-form"
                onChange={this.onChange}
                type="password"
                placeholder="Confirm Password"
              />
              <br/>
              <button id="sign-up-button" className="button-disabled" ref={this.submitButton} disabled={isInvalid} type="submit">Sign Up</button>

              {error && <p>{error.message}</p>}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account?{" "}
    <Link style={{ fontFamily: "'Muli', sans-serif", color: "#7a9fce" }} to={"/signup"}>
      Sign Up
    </Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
