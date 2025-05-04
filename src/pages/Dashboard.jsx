// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Dashboard({ userName }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [book, setBook] = useState(null);
  const [month, setMonth] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    async function fetchPick() {
      try {
        const res = await fetch("http://localhost:8000/monthly/pick", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Failed to fetch monthly pick");
        }
        const data = await res.json();
        setBook(data.suggestion);
        setMonth(data.month);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPick();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center py-5">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          {error}
          <div className="mt-3">
            <Link to="/profile" className="btn btn-primary btn-sm">
              Add your suggestions
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4 text-center">
        <Col>
          <h2 className="fw-bold">Hey {userName || "there"}!</h2>
          <p className="lead">
            Here’s the book we’re reading this month&nbsp;
            <Badge bg="info">
              {month && new Date(month + "-01").toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Badge>
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="text-center">
              <h3 className="fw-bold mb-2">{book.title}</h3>
              {book.author && <p className="mb-3 text-muted">by {book.author}</p>}

              <Link to="/profile" className="btn btn-outline-primary">
                Add / Edit My Suggestions
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}