import React from "react";
import styles from "./Splash.module.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/landing"); // adjust the route if needed
  };

  return (
    <div className={styles.splashContainer}>
      <img src={logo} alt="The Bookish Nine Logo" className={styles.logo} />
      <h1 className={styles.title}>The Bookish Nine</h1>
      <p className={styles.tagline}>Nine opinions. Everyone is wrong.</p>
      <button className={styles.enterButton} onClick={handleClick}>
        Let’s jump in...
      </button>
    </div>
  );
}
