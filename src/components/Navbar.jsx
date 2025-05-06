import React from "react";
import { Navbar as RBNavbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Navbar() {
  const location = useLocation();
  const { token, logout } = useContext(AuthContext);

  return (
    <RBNavbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
      className={styles.navbar}
    >
      <Container>
        <RBNavbar.Brand as={Link} to="/" className={styles.brand}>
        𓆉
        </RBNavbar.Brand>
        <RBNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <RBNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={`${styles.navLink} ${location.pathname === "/" ? styles.active : ""}`}
            >
              Home
            </Nav.Link>

            {token ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className={`${styles.navLink} ${location.pathname === "/dashboard" ? styles.active : ""}`}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  className={`${styles.navLink} ${location.pathname === "/profile" ? styles.active : ""}`}
                >
                  Profile
                </Nav.Link>
                <Nav.Link
                  onClick={logout}
                  className={styles.navLink}
                  role="button"
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={`${styles.navLink} ${location.pathname === "/login" ? styles.active : ""}`}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/signup"
                  className={`${styles.navLink} ${location.pathname === "/signup" ? styles.active : ""}`}
                >
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
}