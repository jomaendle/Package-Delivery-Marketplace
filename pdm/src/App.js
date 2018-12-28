import React, { Component } from 'react';
import Navigation from './components/Navigation';
import { withFirebase } from "./Firebase";
import Header from "./components/Header";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      },
    );
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <div className="App">
      <Header />
      <Navigation authUser={this.state.authUser} />
      </div>
    );
  }
}

export default withFirebase(App);
