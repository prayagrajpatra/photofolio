import React, { useState } from "react";
import styles from "./Carousel.module.css";

// Carousel component to display images with navigation controls (next, previous)
const Carousel = ({ images, onClose, currentImageIndex }) => {
  // State to track the current image index (starts with the provided index)
  const [currentIndex, setCurrentIndex] = useState(currentImageIndex);

  // Handle going to the next image in the carousel
  const handleNext = () => {
    // Update the current index to the next image, wrapping around to the first image
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Handle going to the previous image in the carousel
  const handlePrev = () => {
    // If at the first image, go to the last image, else move to the previous image
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={styles.carousel}>
      {/* Close button to exit the carousel */}
      <button onClick={onClose}>X</button>

      {/* Previous button to navigate to the previous image */}
      <button onClick={handlePrev}>{'<'}</button>

      {/* Display the current image with its URL and title */}
      <img
        src={images[currentIndex].url}
        alt={images[currentIndex].title}
      />

      {/* Next button to navigate to the next image */}
      <button onClick={handleNext}>{'>'}</button>
    </div>
  );
};

export default Carousel;
