import { useState, useContext } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import Lottie from "lottie-react";           // if you still have a Lottie here
import palmData from "../assets/palm.json"; // ditto

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container 
      className={styles.loginContainer} 
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      <h2 className={styles.titleTypewriter}>Log In</h2>

      {error && (
        <Alert variant="danger" className={styles.errorAlert}>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <h6 class={styles.subheading}>cooler if you just used your name</h6>
          <Form.Control
            className={styles.formControl}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <h6 class={styles.subheading}>literally doesn't matter</h6>
          <Form.Control
            type="password"
            className={styles.formControl}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" className={styles.submitButton}>
          Log In
        </Button>
      </Form>

      <p className={styles.signupText}>
        Don’t have an account?{" "}
        <Link to="/signup" className={styles.signupLink}>
          Sign up
        </Link>
      </p>
    </Container>
  );
}