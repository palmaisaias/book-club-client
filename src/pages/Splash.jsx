import React from "react";
import styles from "./Splash.module.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/landing");
  };

  return (
    <div className={styles.splashPageContainer}>
      <img src={logo} alt="The Bookish Nine Logo" className={styles.splashLogo} />
      <h1 className={styles.splashTitle}>The Bookish Nine</h1>
      <p className={styles.splashTagline}>Nine opinions. Everyone is wrong.</p>
      <button className={styles.splashEnterButton} onClick={handleClick}>
        Let’s jump in...
      </button>
    </div>
  );
}
