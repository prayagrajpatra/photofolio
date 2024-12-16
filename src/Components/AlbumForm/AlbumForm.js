import { useState } from "react";
import styles from "./AlbumForm.module.css";

// AlbumForm component to handle the creation of a new album
const AlbumForm = ({ onAddAlbum }) => {
  // State to store the album name entered by the user
  const [albumName, setAlbumName] = useState("");

  // Handle form submission (create a new album)
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    // Check if album name is not empty and add album
    if (albumName.trim()) {
      onAddAlbum(albumName); // Pass the album name to the onAddAlbum function passed as a prop
      setAlbumName(""); // Clear the input field after submission
    }
  };

  // Clear the album name input field
  const handleClear = () => {
    setAlbumName(""); // Reset the album name state to an empty string
  };

  return (
    <div className={styles.albumForm}>
      {/* Heading for the form */}
      <span>Create an album</span>

      {/* Form to create a new album */}
      <form onSubmit={handleSubmit}>
        {/* Input field for album name */}
        <input
          required
          placeholder="Album Name" // Placeholder text for album name input
          value={albumName} // Bind value to albumName state
          onChange={(e) => setAlbumName(e.target.value)} // Update albumName state on input change
        />

        {/* Button to clear the input field */}
        <button type="button" onClick={handleClear}>
          Clear
        </button>

        {/* Button to submit the form and create the album */}
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default AlbumForm;
