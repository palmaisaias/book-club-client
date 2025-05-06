import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext.jsx";
import styles from "./Dashboard.module.css";
import api from "../api/axiosInstance.js";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [book, setBook] = useState(null);
  const [month, setMonth] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);
  const { token, userName } = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      try {
        // Trigger or retrieve the monthly pick via Axios
        const pickResponse = await api.post("/monthly/pick");
        const pickData = pickResponse.data;
        setBook(pickData.suggestion);
        setMonth(pickData.month);

        // Fetch this user's own suggestions via Axios
        const userResponse = await api.get(`/suggestions/user/${userName}`);
        setUserSuggestions(userResponse.data);
      } catch (err) {
        console.error("Dashboard fetchData error:", err);
        const msg = err.response?.data?.detail || err.message || "Error loading data";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token, userName]);

  return (
    <>
      {/* Hero Section always visible */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to the Bookish Nine</h1>
          <p className={styles.heroSubtitle}>
            You're all retarded...
          </p>
        </div>
      </section>

      {/* Conditional Content */}
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
          {/* Monthly Pick */}
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
          <Row className="justify-content-center mb-5">
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

          {/* User Suggestions Section */}
          <Row className="mb-3">
            <Col>
              <h4 className="fw-semibold">Your Suggestions</h4>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              {userSuggestions.length > 0 ? (
                <ul className={styles.suggestionsList}>
                  {userSuggestions.map((s, idx) => (
                    <li key={idx} className={styles.suggestionEntry}>
                      <strong>{s.title}</strong>
                      {s.author && <> by {s.author}</>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted">
                  You haven't suggested any books yet.
                </p>
              )}
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}