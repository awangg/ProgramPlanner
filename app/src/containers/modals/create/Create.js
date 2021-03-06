import React from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import TimePicker from 'react-bootstrap-time-picker';
import Cookies from 'universal-cookie';
import axios from 'axios';
import moment from 'moment';

moment().format();

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      date: '',
      time: '10:00', // TimePicker defaults to 10:00am
      description: '',
      error: ''
    }
    this.cookies = new Cookies();
  }

  handleChange = e => {
    const key = e.target.name;
    const value = e.target.value;
    this.setState({[key]: value})
  }

  handleTimeChange = time => {
    let converted = moment.utc(time * 1000).format("HH:mm");
    this.setState({time: converted});
  }

  /**
   * Sends create request to backend
   * POST /api/events/create.php
   * 
   * @param {object} e Event
   */
  handleFormSubmit = e => {
    e.preventDefault();
    const authHeader = "Bearer " + this.cookies.get('token');
    if(this.state.title.length > 0 && this.state.description.length > 0 && this.state.date.length > 0 && this.state.time.length > 0) {
      axios({
        method: "POST",
        url: "http://localhost/ProgramPlanner/api/events/create.php",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json"
        },
        data: {
          title: this.state.title,
          date: this.state.date + " " + this.state.time + ":00", // Build into MySQL DateTime format
          description: this.state.description
        }
      }).then( response => {
        if (response.data.error) {
          this.setState({'error': response.data.error});
          return;
        }
        this.props.closeModal();
        this.props.reloadEvents();
        this.setState({'error': ''})
      });
    } else {
      this.setState({'error': 'At least one field is missing'});
    }
  }

  render() {
    return (
      <>
      <Form onSubmit={this.handleFormSubmit}>
        <Modal.Header closeButton>
            <Modal.Title>Create a new event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="pull-left" as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={3}>
              Title
            </Form.Label>
            <Col sm={9}>
              <Form.Control type="text" name="title" value={this.state.title} placeholder="Title" onChange={this.handleChange} />
            </Col>
          </Form.Group>

          <Form.Group className="pull-left" as={Row} controlId="formHorizontalPassword">
            <Form.Label column sm={3}>
              Date
            </Form.Label>
            <Col sm={9}>
              <Form.Control type="date" name="date" value={this.state.date} onChange={this.handleChange} />
            </Col>
          </Form.Group>

          <Form.Group className="pull-left" as={Row} controlId="formHorizontalPassword">
            <Form.Label column sm={3}>
              Time
            </Form.Label>
            <Col sm={9}>
              <TimePicker start="10:00" end="21:00" step={30} value={this.state.time} onChange={this.handleTimeChange} />
            </Col>
          </Form.Group>

          <Form.Group className="pull-left" as={Row} controlId="formHorizontalPassword">
            <Form.Label column sm={3}>
              Description
            </Form.Label>
            <Col sm={9}>
              <Form.Control as="textarea" rows="3" name="description" value={this.state.description} placeholder="Description" onChange={this.handleChange} />
            </Col>
          </Form.Group>

          {this.state.error && <Alert as={Row} variant="danger">
            <Col className="text-center" sm={{ span: 12 }}>Error: {this.state.error}</Col>
          </Alert>}
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button type="submit" variant="success">
            Create Event
          </Button>
        </Modal.Footer>
      </Form>
      </>
    )
  }
}

export default Create;