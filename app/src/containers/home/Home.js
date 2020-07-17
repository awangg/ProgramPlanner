import React from 'react';
import axios from "axios";
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
    this.events = [];
    this.registered = [];
    this.cookies = new Cookies();
  }
  componentDidMount() {
    this.retrieveEvents();
    this.getRegisteredEvents();
  }
  retrieveEvents() {
    let authorizationHeader = "Bearer " + this.cookies.get('token');
    axios({
      method: "GET",
      url: "http://localhost/ProgramPlanner/api/events/retrieve.php",
      headers: {
        "Authorization": authorizationHeader,
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
  deleteEvent(e) {
    let authorizationHeader = "Bearer " + this.cookies.get('token');
    axios({
      method: "POST",
      url: "http://localhost/ProgramPlanner/api/events/delete.php",
      headers: {
        "Authorization": authorizationHeader,
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
      this.retrieveEvents();
      this.setState({'error': ''});
    })
  }
  getRegisteredEvents() {
    this.registered = [];
    let authorizationHeader = "Bearer " + this.cookies.get('token');
    axios({
      method: "POST",
      url: "http://localhost/ProgramPlanner/api/events/find.php",
      headers: {
        "Authorization": authorizationHeader,
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
      response.data.map( value => {
        this.registered.push(value);
      });
      this.setState({'error': ''});
    })
  }
  registerEvent(e) {
    let authorizationHeader = "Bearer " + this.cookies.get('token');
    axios({
      method: "POST",
      url: "http://localhost/ProgramPlanner/api/events/signup.php",
      headers: {
        "Authorization": authorizationHeader,
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
      this.retrieveEvents();
      this.getRegisteredEvents();
      this.setState({'error': ''});
    })
  }
  cancelEvent(e) {
    let authorizationHeader = "Bearer " + this.cookies.get('token');
    axios({
      method: "POST",
      url: "http://localhost/ProgramPlanner/api/events/backout.php",
      headers: {
        "Authorization": authorizationHeader,
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
      this.retrieveEvents();
      this.getRegisteredEvents();
      this.setState({'error': ''});
    })
  }
  openEdit() {
    this.setState({'editing': true})
  }
  closeEdit() {
    this.setState({'editing': false})
  }
  openCreate() {
    this.setState({'creating': true})
  }
  closeCreate() {
    this.setState({'creating': false})
  }
  render() {
    if(!this.props.authenticated) {
      return (
        <div className="Home">
          <Alert as={Row} variant="danger">
            <Col className="text-center" sm={{ span: 12 }}>You are not authorized to view this page</Col>
          </Alert>
        </div>
      );
    }
    return (
      <div className="Home">
        <Container fluid>
          <h1 className="display-4 text-center"> Browse Sessions </h1>
          {this.state.error && <Alert as={Row} variant="danger">
            <Col className="text-center" sm={{ span: 12 }}>Error: {this.state.error}</Col>
          </Alert>}
          {this.events.length <= 0 && <Alert as={Row} variant="danger" className="my-5">
            <Col className="text-center" sm={{ span: 12 }}>No Events</Col>
          </Alert>}
          {this.events.length > 0 && this.events.map(event => 
            <Row className="my-4">
              <Col sm={{ span: 12}}>
                <Card>
                  <Card.Body>
                    <Card.Title>{event.title}</Card.Title>
                    <Card.Subtitle><Moment format="ddd MMMM Do YYYY @ hh:mma">{event.date}</Moment></Card.Subtitle>
                    <hr />
                    <Card.Text>
                      {event.description}
                    </Card.Text>
                    <hr />
                    <Card.Text className="text-center text-danger"><strong>{event.attendance} registered</strong></Card.Text>
                    <div class="text-center">
                      {!this.registered.includes(event.id) && <Button value={event.id} variant="primary" className="mx-1" onClick={this.registerEvent.bind(this)}>Register</Button>}
                      {this.registered.includes(event.id) && <Button value={event.id} variant="danger" className="mx-1" onClick={this.cancelEvent.bind(this)}>Cancel</Button>}
                      <Button variant="warning" className="mx-1" onClick={this.openEdit.bind(this)}>Edit</Button>
                      <Modal show={this.state.editing} onHide={this.closeEdit.bind(this)}>
                        <Edit event={event} closeModal={this.closeEdit.bind(this)} retrieveEvents={this.retrieveEvents.bind(this)} />
                      </Modal>
                      <Button value={event.id} variant="danger" className="mx-1" onClick={this.deleteEvent.bind(this)}>Delete</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
          <Row>
            <Col className="text-center">
              <Button variant="success" onClick={this.openCreate.bind(this)}>Add an Event</Button>
              <Modal show={this.state.creating} onHide={this.closeCreate.bind(this)}>
                <Create closeModal={this.closeCreate.bind(this)} retrieveEvents={this.retrieveEvents.bind(this)} />
              </Modal>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;