import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import * as network from "../network/network"
import modalStyles from "../styles/modal.module.css"
import { useState } from "react";

interface LoginModalProps {
  onLogin: (username: string) => void;
}

function LoginModal({ onLogin }: LoginModalProps) {
  const [showLogin, setShowLogin] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Something went wrong.");
  const [username, setUsername] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loggedIn = await network.getUser(username);
      if (loggedIn) {
        onLogin(loggedIn);
        setShowLogin(false);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. "+error);
      setShowError(true);
    }
  }

  const handleLoginFormChange = (e: any) => {
    setUsername(e.target.value);
  }

  return (
    <>
      <Modal show={ showLogin } backdrop="static" keyboard={false} centered dialogClassName={ modalStyles.Modal }>
        <Modal.Body>
          <Form onSubmit={handleLoginSubmit} id="loginForm">
            <Form.Group controlId="username-input">
              <Row className="d-flex justify-content-center">
                <Col xs="auto">
                  <Form.Control className="align-self-center me-2 mt-2 mb-2" name="username" type="text" autoFocus required onChange={ handleLoginFormChange } placeholder="Enter your username"/>
                </Col>
                <Col xs="auto">
                  <Button variant="success" type="submit" form="loginForm" className="me-2 mt-2 mb-2">Log in</Button>
                </Col>
              </Row>
            </Form.Group>
            { showError &&
              <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                <Alert.Heading>Oops!</Alert.Heading>
                <p> { errorMessage } </p>
              </Alert>
            }
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoginModal;