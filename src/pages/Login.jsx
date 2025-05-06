import { useState, useContext, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import Lottie from "lottie-react";           // if you still have a Lottie here
import palmData from "../assets/palm.json"; // ditto

function Typewriter({ text, speed = 100 }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, idx + 1));
      if (navigator.vibrate) navigator.vibrate(10);
      idx++;
      if (idx >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return <h2 className={styles.titleTypewriter}>{displayed}</h2>;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const titles = [
    "Log the hell in",
    "Prove you exist",
    "Enter. Or don’t.",
    "Just do it. Ugh",
    "Sign in, clown.",
    "This again? Ffs",
    "Back already?",
    "You poor soul."
  ];

  useEffect(() => {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    setTitle(randomTitle);
  }, []);

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
      <Typewriter text={title} speed={150} />
      {error && (
        <Alert variant="danger" className={styles.errorAlert}>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          
          <Form.Control
            className={styles.formControl}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          
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