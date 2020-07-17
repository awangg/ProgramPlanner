import React from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import TimePicker from 'react-bootstrap-time-picker';
import Cookies from 'universal-cookie';
import axios from 'axios';
import moment from 'moment';

moment().format();

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.event.title,
      date: moment(this.props.event.date).format("YYYY-MM-DD"),
      time: moment(this.props.event.date).format("HH:mm"),
      description: this.props.event.description
    }
    this.cookies = new Cookies();
  }
  handleChange = e => {
    const key = e.target.name;
    const value = e.target.value;
    console.log(value)
    this.setState({[key]: value})
  }
  handleTimeChange = time => {
    let converted = moment.utc(time * 1000).format("HH:mm");
    this.setState({time: converted});
  }
  handleFormSubmit = e => {
    e.preventDefault();
    let authorizationHeader = "Bearer " + this.cookies.get('token');
    console.log(this.state.date + " " + this.state.time + ":00");
    if(this.state.title.length > 0 && this.state.description.length > 0 && this.state.date.length > 0 && this.state.time.length > 0) {
      axios({
        method: "POST",
        url: "http://localhost/ProgramPlanner/api/events/update.php",
        headers: {
          "Authorization": authorizationHeader,
          "Content-Type": "application/json"
        },
        data: {
          id: this.props.event.id,
          title: this.state.title,
          date: this.state.date + " " + this.state.time + ":00",
          description: this.state.description
        }
      }).then( response => {
        if (response.data.error) {
          this.setState({'error': response.data.error});
          return;
        }
        this.props.closeModal();
        this.props.retrieveEvents();
      });
    }
  }
  render() {
    return (
      <>
      <Form onSubmit={this.handleFormSubmit}>
        <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
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
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
      </>
    )
  }
}

export default Edit;