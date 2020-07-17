import React from 'react';
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from 'universal-cookie';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';

import './Signup.css';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.cookies = new Cookies();
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      error: '',
      redirect: false
    }
  }
  handleChange = e => {
    const key = e.target.name;
    const value = e.target.value;
    this.setState({[key]: value})
  }
  handleFormSubmit = e => {
    e.preventDefault();
    if(this.state.username.length <= 0 || this.state.password.length <= 0 || this.state.confirmPassword.length <= 0) {
      this.setState({error: "At least one field is not filled"});
    } else if (this.state.password != this.state.confirmPassword) {
      this.setState({error: "Passwords do not match"});
    } else {
      axios({
        method: "POST",
        url: "http://localhost/ProgramPlanner/api/auth/register.php",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          username: this.state.username,
          password: this.state.password
        }
      }).then( response => {
        if (response.data.error) {
          this.setState({'error': response.data.error});
          return;
        }
        this.setState({error: ""});
        this.setState({redirect: true})
      })
    }
  }
  render() {
    let redirect = this.state.redirect;
    if(redirect) {
      return <Redirect to="/login" />
    }
    return (
      <div className="Signup text-center">
        <Form onSubmit={this.handleFormSubmit}>
          <Form.Group className="pull-left" as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={3}>
              Username
            </Form.Label>
            <Col sm={9}>
              <Form.Control type="text" name="username" value={this.state.username} placeholder="Username" onChange={this.handleChange} />
            </Col>
          </Form.Group>

          <Form.Group className="pull-left" as={Row} controlId="formHorizontalPassword">
            <Form.Label column sm={3}>
              Password
            </Form.Label>
            <Col sm={9}>
              <Form.Control type="password" name="password" value={this.state.password} placeholder="Password" onChange={this.handleChange} />
            </Col>
          </Form.Group>

          <Form.Group className="pull-left" as={Row} controlId="formConfirmPassword">
            <Form.Label column sm={3}>
              Confirm
            </Form.Label>
            <Col sm={9}>
              <Form.Control type="password" name="confirmPassword" value={this.state.confirmPassword} placeholder="Confirm Password" onChange={this.handleChange} />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Col sm={{ span: 12 }}>
              <Button type="submit">Sign in</Button>
            </Col>
          </Form.Group>

          {this.state.error && <Alert as={Row} variant="danger">
          <Col className="text-center" sm={{ span: 12 }}>Error: {this.state.error}</Col>
        </Alert>}
        </Form>
      </div>
    );
  }
}

export default Signup;