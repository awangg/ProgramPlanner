import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import Cookies from 'universal-cookie';

import Routes from './Routes';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false
    };
    this.cookies = new Cookies();
  }
  componentDidMount() {
    if(this.cookies.get('token')) this.setState({authenticated: true});
  }
  setAuthentication(value) {
    this.setState({authenticated: value});
  }
  logOut() {
    this.cookies.remove('token');
    this.cookies.remove('username');
    this.cookies.remove('user_id');
  }
  render() {
    return (
      <div className="App container">
        <Navbar bg="dark" variant="dark" sticky="top">
          <Navbar.Brand>
            <Link to="/">
              <img
                src="logo192.png"
                height="30"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />
            </Link>
          </Navbar.Brand>{!this.state.authenticated &&
          <Navbar.Collapse>
            <Nav className="ml-auto">
              <Nav.Link href="/signup">Signup</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>}
          {this.state.authenticated &&
          <Navbar.Collapse>
            <Nav className="ml-auto">
              <Nav.Link href="/login" onClick={this.logOut.bind(this)}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>}
          <Navbar.Toggle />
        </Navbar>
        <Routes authenticated={this.state.authenticated} setAuthentication={this.setAuthentication.bind(this)} />
      </div>
    );
  }
}

export default App;
