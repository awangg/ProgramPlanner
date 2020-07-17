import React from "react";
import Cookies from 'universal-cookie';
import { Route, Switch } from "react-router-dom";

import Error from './containers/error/Error';
import Login from "./containers/login/Login";
import Signup from './containers/signup/Signup';
import Home from "./containers/home/Home";

class Routes extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.cookies = new Cookies();
    if(this.cookies.get('token')) this.setState({authenticated: true});
  }
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