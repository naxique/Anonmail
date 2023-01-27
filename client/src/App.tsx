import React, { useEffect, useState } from 'react';
import LoginModal from './components/LoginModal';
import { Message } from './models/Message';
import { Button, Card, Col, ListGroup, Row, Tab } from 'react-bootstrap';
import mainStyles from "./styles/main.module.css"
import * as network from "./network/network"
import NewMessageModal from './components/NewMessageModal';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const loadMessages = async (username: string) => {
    try {
      const m = await network.getMessages(username);
      setMessages(m);
    } catch (error) {
      console.error(error)
    }
  };

  const checkForMessages = async () => {
    try {
      const newMessages = await network.getMessages(username);
      if (newMessages.length > messages.length) setMessages(newMessages);
    } catch (error) {
      console.error(error);
    }
  };

  // Try websockets later (TODO)
  useEffect(() => {
    if (!showLogin) {
      const timer = setInterval(() => {
        checkForMessages();
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [username]);

  const loggedIn = (u: string): void => {
    setUsername(u);
    loadMessages(u);
    setShowLogin(false);
  };

  const newMessageFormDismiss = () => {
    setShowNewMessageModal(false);
  };

  return (
    <div className={showLogin || showNewMessageModal ? mainStyles.backdropBlur : mainStyles.noBackdropBlur}>
      { showLogin &&
        <LoginModal onLogin={ loggedIn } />
      }
      { showNewMessageModal &&
        <NewMessageModal senderUsername={ username } onDismiss={ newMessageFormDismiss } />
      }
      <Tab.Container id="mail-container">
        <Row className="m-auto vh-100 justify-content-center">
          <Col sm={4} className="mt-5 mb-5">
            <Card className={ mainStyles.Card }>
              <Card.Header className="d-flex justify-content-between">
                <span className="align-self-center"><b>{ username }'s inbox</b></span>
                <Button onClick={ () => { setShowNewMessageModal(true) } }>Send anonmail</Button>
              </Card.Header>
              <ListGroup variant="flush" className={ mainStyles.listContent }>
                { messages.map((msg, i) => {
                  return (
                    <ListGroup.Item key={i} action href={"#"+msg._id}>
                      <p><small>from: </small>{msg.sender}<small> title: </small>{msg.title}</p>
                      <p><small>{ new Date(msg.sentAt).toLocaleString('en-GB', { dateStyle: "short" , timeStyle: "short" }) }</small></p>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card>
          </Col>
          <Col sm={5} className="mt-5 mb-5">
            <Tab.Content style={{ height: '100%' }}>
            { messages.map((msg, i) => {
              return (
                  <Tab.Pane eventKey={"#"+msg._id} className={ mainStyles.Card } key={i}>
                    <Card className={ mainStyles.Card } key={i}>
                      <Card.Header><b>{ msg.sender }: </b>{ msg.title }</Card.Header>
                      <Card.Body className={ mainStyles.Content }>
                        <Card.Text> { msg.message } </Card.Text>
                      </Card.Body>
                      <Card.Footer><span className="text-muted">{ new Date(msg.sentAt).toLocaleString('en-GB', 
                      { dateStyle: "short" , timeStyle: "short" }) }</span></Card.Footer>
                    </Card>
                  </Tab.Pane>
              );
            })}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default App;
