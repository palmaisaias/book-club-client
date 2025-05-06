import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import styles from "./Landing.module.css";
import Lottie from "lottie-react";
import palmData from "../assets/palm.json"

export default function Landing() {
  return (
    <Container className={styles.landingContainer}>
      <Row className={`${styles.hero} mb-4 text-center ${styles.heroRow}`}>
        <Col md={6} className={`${styles.textCol} d-flex flex-column justify-content-center`}>
          {/* <img src={logo} className={styles.logo} alt="Book Club Logo" /> */}
          <h1 className={styles.heading}>Palma Siblings<br />Book Club</h1>
          <p className={styles.subheading}>Read. Argue. Repeat.</p>
        </Col>
        <Lottie
          animationData={palmData}
          loop
          autoplay
          className={styles.lottieBehind}
        />
      </Row>
      <Row>
        <Col className={styles.buttonGroup}>
          <Button as={Link} to="/login" className={styles.btnPrimary}>
            Log In
          </Button>
          <Button as={Link} to="/signup" className={styles.btnSecondary}>
            Sign Up
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
