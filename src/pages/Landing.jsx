import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Landing() {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Row className="mb-4 text-center">
        <Col>
          <img src={logo} width={120} alt="Book Club Logo" />
          <h1 className="mt-3 fw-bold">Sibling Book Club</h1>
          <p className="lead">Read. Argue. Repeat.</p>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex gap-3 justify-content-center">
          <Button as={Link} to="/login" variant="primary">
            Log In
          </Button>
          <Button as={Link} to="/signup" variant="outline-primary">
            Sign Up
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
