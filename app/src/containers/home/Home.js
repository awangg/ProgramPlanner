import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Alert, Modal, Container, Row, Col, Card, Button } from 'react-bootstrap';
import Moment from 'react-moment';

import Create from '../modals/create/Create';
import Edit from '../modals/edit/Edit';
import './Home.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      events: [],
      creating: false,
      editing: false
    }
    this.authorizationHeader = '';
    this.events = [];
    this.registered = [];
    this.cookies = new Cookies();
  }

  componentDidMount() {
    this.getAllEvents();
    this.getUserRegistration();
  }

  /**
   * Retrieves all events from DB
   * GET /api/events/retrieve.php
   */
  getAllEvents() {
    const authHeader = "Bearer " + this.cookies.get('token');
    axios({
      method: "GET",
      url: "http://localhost/ProgramPlanner/api/events/retrieve.php",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      }
    }).then( response => {
      if (response.data.error) {
        this.setState({'error': response.data.error});
        return;
      }
      this.events = response.data;
      this.setState({'error': ''});
    })
  }

  /**
   * Deletes event from DB
   * POST /api/events/delete.php
   * 
   * @param {object} e Event
   */
  deleteEvent(e) {
    const authHeader = "Bearer " + this.cookies.get('token');
    axios({
      method: "POST",
      url: "http://localhost/ProgramPlanner/api/events/delete.php",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      data: {
        "id": e.target.value
      }
    }).then( response => {
      if (response.data.error) {
        this.setState({'error': response.data.error});
        return;
      }
      // Reload events page
      this.getAllEvents();
      this.setState({'error': ''});
    })
  }

  /**
   * Retrieves events that the current user is registered for
   * POST /api/events/attendance.php
   */
  getUserRegistration() {
    this.registered = [];
    const authHeader = "Bearer " + this.cookies.get('token');
    axios({
      method: "POST",
      url: "http://localhost/ProgramPlanner/api/events/attendance.php",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      data: {
        "user": parseInt(this.cookies.get('user_id'))
      }
    }).then( response => {
      if (response.data.error) {
        this.setState({'error': response.data.error});
        return;
      }
      response.data.map( value => { this.registered.push(value) });
      this.setState({'error': ''});
    })
  }

  /**
   * Registers user for specified event
   * POST /api/events/signup.php
   * 
   * @param {object} e Event 
   */
  registerForEvent(e) {
    const authHeader = "Bearer " + this.cookies.get('token');
    axios({
      method: "POST",
      url: "http://localhost/ProgramPlanner/api/events/signup.php",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      data: {
        "user": parseInt(this.cookies.get('user_id')),
        "event": e.target.value
      }
    }).then( response => {
      if (response.data.error) {
        this.setState({'error': response.data.error});
        return;
      }
      this.getAllEvents();
      this.getUserRegistration();
      this.setState({'error': ''});
    })
  }

  /**
   * Cancels users existing registration for an event
   * POST /api/events/backout.php
   * 
   * @param {object} e Event
   */
  cancelOnEvent(e) {
    const authHeader = "Bearer " + this.cookies.get('token');
    axios({
      method: "POST",
      url: "http://localhost/ProgramPlanner/api/events/backout.php",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      data: {
        "user": parseInt(this.cookies.get('user_id')),
        "event": e.target.value
      }
    }).then( response => {
      if (response.data.error) {
        this.setState({'error': response.data.error});
        return;
      }
      this.getAllEvents();
      this.getUserRegistration();
      this.setState({'error': ''});
    })
  }

  /**
   * Controls show/hide for edit modal
   */
  openEdit(e) {
    this.setState({'currentEvent': e.target.value});
    this.setState({'editing': true});
  }
  closeEdit() {
    this.setState({'editing': false});
  }

  /**
   * Controls show/hide for create modal
   */
  openCreate() {
    this.setState({'creating': true});
  }
  closeCreate() {
    this.setState({'creating': false});
  }

  render() {
    if(!this.props.authenticated) {
      return (
        <Alert as={Row} variant="danger">
          <Col className="text-center" sm={{ span: 12 }}>You are not authorized to view this page</Col>
        </Alert>
      );
    }

    return (
      <div className="Home">
        <Container fluid>
          <h1 className="text-center"> Browse Sessions </h1>

          {this.state.error && <Alert as={Row} variant="danger">
            <Col className="text-center" sm={{ span: 12 }}>Error: {this.state.error}</Col>
          </Alert>}
          {this.events.length <= 0 && <Alert as={Row} variant="danger" className="my-5">
            <Col className="text-center" sm={{ span: 12 }}>No Events</Col>
          </Alert>}

          {this.events.length > 0 && this.events.map(event => 
            <Row className="my-4" key={event.id}>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title><strong>{event.title}</strong></Card.Title>
                    <Card.Subtitle><Moment format="ddd MMMM Do YYYY @ hh:mma">{event.date}</Moment></Card.Subtitle>
                    <hr />
                    <Card.Text>
                      {event.description}
                    </Card.Text>
                    <hr />
                    <Card.Text className="text-center text-danger"><strong>{event.attendance} registered</strong></Card.Text>
                    <div className="text-center">
                      {!this.registered.includes(event.id) && <Button value={event.id} variant="primary" className="mx-1 my-2" onClick={this.registerForEvent.bind(this)}>Register</Button>}

                      {this.registered.includes(event.id) && <Button value={event.id} variant="danger" className="mx-1 my-2" onClick={this.cancelOnEvent.bind(this)}>Cancel</Button>}

                      <Button value={event.id} variant="warning" className="mx-1 my-2" onClick={this.openEdit.bind(this)}>Edit</Button>
                      <Button value={event.id} variant="danger" className="mx-1 my-2" onClick={this.deleteEvent.bind(this)}>Delete</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
          <Row>
            <Col className="text-center">
              <Button variant="success" onClick={this.openCreate.bind(this)}>Add an Event</Button>
            </Col>
          </Row>
        </Container>
          
        <Modal show={this.state.creating} onHide={this.closeCreate.bind(this)}>
          <Create closeModal={this.closeCreate.bind(this)} reloadEvents={this.getAllEvents.bind(this)} />
        </Modal>

        <Modal show={this.state.editing} onHide={this.closeEdit.bind(this)}>
          <Edit event={this.state.currentEvent} closeModal={this.closeEdit.bind(this)} reloadEvents={this.getAllEvents.bind(this)} />
        </Modal>
      </div>
    );
  }
}

export default Home;