import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import styles from "./Profile.module.css";
import api from "../api/axiosInstance.js";

export default function Profile() {
  const navigate = useNavigate();
  const { token, userName } = useContext(AuthContext);
  console.log("Profile component mounted", { userName, token });

  // Use a storage key unique to this user
  const storageKey = `bookSuggestions-${userName}`;

  // Pull saved suggestions (if any) from localStorage
  const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const [suggestions, setSuggestions] = useState(
    stored.length ? stored : [{ title: "", author: "" }]
  );
  console.log("Initial suggestions state:", suggestions);

  // Persist changes to that per-user key
  useEffect(() => {
    console.log("Persisting suggestions to localStorage:", suggestions);
    localStorage.setItem(storageKey, JSON.stringify(suggestions));
  }, [suggestions, storageKey]);

  const handleChange = (idx, field, value) => {
    console.log("handleChange:", { idx, field, value });
    setSuggestions((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const addRow = () => {
    console.log("addRow invoked, before:", suggestions);
    if (suggestions.length < 4) {
      setSuggestions([...suggestions, { title: "", author: "" }]);
    }
  };

  const removeRow = (idx) => {
    console.log("removeRow invoked, index:", idx, "before:", suggestions);
    setSuggestions((prev) => prev.filter((_, i) => i !== idx));
  };

  // Now wired as form submit handler
  const handleSave = async (e) => {
    e.preventDefault();
    console.log("handleSave invoked; suggestions:", suggestions, "userName:", userName);

    try {
      for (const s of suggestions) {
        if (!s.title.trim()) continue;

        const payload = { username: userName, title: s.title, author: s.author };
        console.log("Axios POST /suggestions/ payload:", payload);

        // Use axios instance; throws on non-2xx
        try {
          const response = await api.post("/suggestions/", payload);
          console.log("Axios response data:", response.data);
        } catch (err) {
          const resData = err.response?.data;
          console.error("Axios error response:", resData);

          // Build friendly error message
          let errMsg = "Save failed";
          if (Array.isArray(resData)) {
            errMsg = resData
              .map(e => `${e.loc.slice(-1)[0]}: ${e.msg}`)
              .join("; ");
          } else if (Array.isArray(resData?.detail)) {
            errMsg = resData.detail
              .map(e => `${e.loc.slice(-1)[0]}: ${e.msg}`)
              .join("; ");
          } else if (typeof resData?.detail === "string") {
            errMsg = resData.detail;
          }
          throw new Error(errMsg);
        }
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Save failed:", err);
      alert(`Couldn’t save—${err.message}`);
    }
  };

  return (
    <Container className={styles.wrapper}>
      <Row className={styles.header}>
        <Col>
          <h2 className="fw-bold">Hey {userName}!</h2>
          <p className="lead">Add up to four books you’d like us to read.</p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className={`${styles.card} shadow`}>
            <Card.Body>
              {/* Attach onSubmit here */}
              <Form onSubmit={handleSave}>
                {suggestions.map((s, idx) => (
                  <div key={idx} className={styles.suggestionItem}>
                    <Form.Group className={styles.formGroup}>
                      <Form.Label>Title #{idx + 1}</Form.Label>
                      <Form.Control
                        value={s.title}
                        placeholder="Book title"
                        onChange={(e) => handleChange(idx, "title", e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className={styles.formGroup}>
                      <Form.Label>Author</Form.Label>
                      <Form.Control
                        value={s.author}
                        placeholder="Author name"
                        onChange={(e) => handleChange(idx, "author", e.target.value)}
                      />
                    </Form.Group>

                    {idx > 0 && (
                      <Button
                        variant="link"
                        className={styles.removeButton}
                        onClick={() => removeRow(idx)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  variant="secondary"
                  className={styles.addButton}
                  onClick={addRow}
                  disabled={suggestions.length === 4}
                >
                  + Add another
                </Button>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    className={styles.saveButton}
                  >
                    Save & Return to Dashboard
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}