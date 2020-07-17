import React from "react";
import { Route, Switch } from "react-router-dom";

import Error from './containers/error/Error';
import Login from "./containers/login/Login";
import Signup from './containers/signup/Signup';
import Home from "./containers/home/Home";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        {this.props.authenticated &&
        <Route exact path="/">
          <Home authenticated={this.props.authenticated} />
        </Route>}
        {!this.props.authenticated &&
        <Route exact path="/">
          <Login setAuthentication={this.props.setAuthentication} />
        </Route>}
        <Route path="/login">
          <Login setAuthentication={this.props.setAuthentication} />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/home">
          <Home authenticated={this.props.authenticated} />
        </Route>
        <Route>
          <Error />
        </Route>
      </Switch>
    );
  }
}

export default Routes;