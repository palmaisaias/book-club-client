import { useState, useContext } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Signup.module.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className={styles.signupContainer} style={{ maxWidth: "400px" }}>
      <h2 className={styles.titleTypewriter}>Sign Up</h2>
      <h6 className={styles.subheading}>...don't be a little bitch</h6>
      {error && <Alert variant="danger" className={styles.errorAlert}>{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
        <Form.Label style={{ marginBottom: '0px', fontWeight: 300 }}>Username</Form.Label>
          <h6 class={styles.subheading}>cooler if you just used your name</h6>
          <Form.Control
            className={styles.formControl}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
        <Form.Label style={{ marginBottom: '0px', fontWeight: 300 }}>
  Password
</Form.Label>
          <h6 class={styles.subheading}>literally doesn't matter</h6>
          <Form.Control
            type="password"
            className={styles.formControl}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" className={styles.submitButton}>Sign Up</Button>
      </Form>
      <p className={styles.signupText}>
        Already have an account?...but forgot?...because you're dumb? <Link to="/login" className={styles.signupLink}>Log in</Link>
      </p>
    </Container>
  );
}