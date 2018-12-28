import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from "./SignIn/index";
import Home from "./Home";
import SignUp from "./SignUp/index"
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Firebase, { FirebaseContext } from './Firebase';

require('dotenv').load();

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={App}></Route>
                <Route exact path="/login" component={Login}></Route>
                <Route exact path="/home" component={Home}></Route>
                <Route exact path="/signup" component={SignUp}></Route>
            </Switch>
        </BrowserRouter>
    </FirebaseContext.Provider>, document.getElementById('root')
    );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
