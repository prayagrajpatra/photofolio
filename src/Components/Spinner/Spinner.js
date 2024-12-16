import React from "react";
import styles from "./Spinner.module.css"; 

// Spinner component that displays a loading animation
const Spinner = () => {
  return (
    // The spinner overlay that covers the screen
    <div className={styles.spinnerOverlay}>
      
      {/* The spinner element that shows the rotating loading animation */}
      <div className={styles.spinner}></div>

    </div>
  );
};

export default Spinner;
