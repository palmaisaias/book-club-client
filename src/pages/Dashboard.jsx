import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext.jsx";
import styles from "./Dashboard.module.css";

// Base API URL from Vite env or fallback for dev
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [book, setBook] = useState(null);
  const [month, setMonth] = useState("");
  const { token, userName } = useContext(AuthContext);

  useEffect(() => {
    async function fetchPick() {
      try {
        const res = await fetch(`${API_URL}/monthly/pick`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "No suggestions available");
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
  }, [token]);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to the Bookish Nine</h1>
          <p className={styles.heroSubtitle}>This Month’s Escape Awaits... and it’s probably better than last month’s, but no promises.</p>
        </div>
      </section>

      {/* Main Content */}
      {loading ? (
        <Container className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" />
        </Container>
      ) : error ? (
        <Container className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>{error}</h3>
          <p className={styles.emptyText}>
            Looks like you haven’t added any book suggestions yet.
          </p>
          <Button as={Link} to="/profile" variant="primary">
            Add Suggestions
          </Button>
        </Container>
      ) : (
        <Container className="py-5">
          <Row className="mb-4 text-center">
            <Col>
              <motion.h2
                className="fw-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Hey {userName}!
              </motion.h2>
              <p className="lead">
                Here’s the book we’re reading this month{" "}
                <span className="badge bg-info text-uppercase">
                  {month &&
                    new Date(month + "-01").toLocaleString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                </span>
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="shadow">
                <Card.Body className="text-center">
                  <h3 className="fw-bold mb-2">{book.title}</h3>
                  {book.author && (
                    <p className="mb-3 text-muted">by {book.author}</p>
                  )}
                  <Button as={Link} to="/profile" variant="outline-primary">
                    Add / Edit My Suggestions
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}