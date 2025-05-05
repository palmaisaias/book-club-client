import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Profile() {
  const navigate = useNavigate();
  const { token, userName } = useContext(AuthContext);

  // Use a storage key unique to this user
  const storageKey = `bookSuggestions-${userName}`;

  // Pull saved suggestions (if any) from localStorage
  const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const [suggestions, setSuggestions] = useState(
    stored.length ? stored : [{ title: "", author: "" }]
  );

  // Persist changes to that per-user key
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(suggestions));
  }, [suggestions, storageKey]);

  const handleChange = (idx, field, value) =>
    setSuggestions((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );

  const addRow = () => {
    if (suggestions.length < 4) {
      setSuggestions([...suggestions, { title: "", author: "" }]);
    }
  };

  const removeRow = (idx) => {
    setSuggestions(suggestions.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    try {
      for (const s of suggestions) {
        if (!s.title.trim()) continue;
        await fetch("https://book-club-server-qlrh.onrender.com/suggestions/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: userName,
            title: s.title,
            author: s.author,
          }),
        });
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Couldn’t save—check the console.");
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4 text-center">
        <Col>
          <h2 className="fw-bold">Hey {userName}!</h2>
          <p className="lead">Add up to four books you’d like us to read.</p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body>
              <Form>
                {suggestions.map((s, idx) => (
                  <div key={idx} className="mb-3 border-bottom pb-3">
                    <Form.Group className="mb-2">
                      <Form.Label>Title #{idx + 1}</Form.Label>
                      <Form.Control
                        value={s.title}
                        placeholder="Book title"
                        onChange={(e) =>
                          handleChange(idx, "title", e.target.value)
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Author</Form.Label>
                      <Form.Control
                        value={s.author}
                        placeholder="Author name"
                        onChange={(e) =>
                          handleChange(idx, "author", e.target.value)
                        }
                      />
                    </Form.Group>
                    {idx > 0 && (
                      <Button
                        variant="link"
                        className="p-0 mt-2 text-danger"
                        onClick={() => removeRow(idx)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  variant="secondary"
                  className="mb-3"
                  onClick={addRow}
                  disabled={suggestions.length === 4}
                >
                  + Add another
                </Button>

                <div className="d-grid">
                  <Button variant="primary" onClick={handleSave}>
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