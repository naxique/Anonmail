import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import * as network from "../network/network"
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

interface NewMessageProps {
  senderUsername: string,
  onDismiss: () => void;
}

function NewMessageModal({ onDismiss, senderUsername }: NewMessageProps) {
  const [showMesageModal, setShowMessageModal] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [destinationUsername, setDestinationUsername] = useState("");
  const [message, setMessage] = useState({ title: "", message: "" })
  const [isAutocompleteLoading, setIsAutocompleteLoading] = useState(true);
  const [users, setUsers] = useState<string[]>([]);

  const getUsernames = async () => {
    try {
      const u = await network.getAllUsers();
      setUsers(u);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsernames();
  }, []);

  async function newMessage() {
    const responce = await network.newMessage({ sender: senderUsername, destination: destinationUsername, 
                                                title: message.title, message: message.message });
    if (responce.title === message.title) {
      setShowMessageModal(false);
      onDismiss();
    }
  }

  const handleMessageModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (destinationUsername === "" || message.title === "" || message.message === "") {
      setErrorMessage("Please fill all fields.");
      setShowError(true);
    }
    try {
      newMessage();
    } catch (error) {
      console.error(error)
      setErrorMessage("Something went wrong. "+error);
      setShowError(true);
    }
  };

  const handleFormChange = (e: any) => {
    setMessage({...message, [e.target.name]: e.target.value});
  };

  return (
    <>
      <Modal show={ showMesageModal } backdrop="static" centered>
        <Modal.Body>
          <Form noValidate onSubmit={ handleMessageModalSubmit } id="newMessageForm">
            <Form.Group className="mb-2" controlId="destination-input">
              <AsyncTypeahead id="destination" placeholder="Recipient" options={ users } isLoading={ isAutocompleteLoading } onSearch={async () => { 
                setIsAutocompleteLoading(true);
                const u = await network.getAllUsers();
                if (u) { setUsers(u); setIsAutocompleteLoading(false)}; 
              }} onInputChange={ setDestinationUsername } onChange={v => setDestinationUsername(String(v[0])) } />
            </Form.Group>
            <Form.Group className="mb-3" controlId="title-input">
              <Form.Control name="title" type="text" required onChange={ handleFormChange } placeholder="Title" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="message-input">
              <Form.Control name="message" as="textarea" required onChange={ handleFormChange } />
            </Form.Group>
            <Button variant="secondary" className="me-3" onClick={() => { setShowMessageModal(false); onDismiss() }}>Close</Button>
            <Button variant="success" type="submit" form="newMessageForm">Send</Button>
          </Form>
          { showError &&
            <Alert variant="danger" onClose={() => setShowError(false)} dismissible className="mt-2">
              <p> { errorMessage } </p>
            </Alert>
          }
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewMessageModal;