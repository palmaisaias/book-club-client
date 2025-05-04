import { useState } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";   // swap for your actual logo file

export default function Landing({ setUserName }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setUserName(trimmed);       // lift state up to App.jsx
    navigate("/dashboard");     // go to the main page
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Row className="mb-4 text-center">
        <Col>
          <img src={logo} width={120} alt="Book Club Logo" />
          <h1 className="mt-3 fw-bold">Sibling Book Club</h1>
        </Col>
      </Row>

      <Card style={{ maxWidth: "24rem" }} className="w-100 shadow">
        <Card.Body>
          <Card.Title className="mb-3 fw-semibold">Jump in!</Card.Title>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nameInput">
              <Form.Label>Your name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Mary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 mt-3">
              Enter
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}