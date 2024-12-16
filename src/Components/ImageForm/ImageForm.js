import { useState, useEffect } from "react";
import styles from "./ImageForm.module.css";

// ImageForm component to handle both adding and updating images in an album
const ImageForm = ({ albumName, onAddImage, onUpdateImage, editMode, editableImage}) => {
  // State to hold the values for image title and image URL
  const [imageTitle, setImageTitle] = useState("");
  const [imageURL, setImageURL] = useState("");

  // useEffect hook to populate form fields when in edit mode
  useEffect(() => {
    // If we are in edit mode and there is an image to edit, populate the fields
    if (editMode && editableImage) {
      setImageTitle(editableImage.title);
      setImageURL(editableImage.url);
    } else {
      // Clear form if not in edit mode
      setImageTitle("");
      setImageURL("");
    }
  }, [editMode, editableImage]);

  // Handle form submission (add or update image)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // If in edit mode, update the image
    if (editMode && editableImage) {
      const updatedImage = {
        id: editableImage.id,
        title: imageTitle.trim(),
        url: imageURL.trim(),
      };
      await onUpdateImage(albumName, updatedImage); // Call the onUpdateImage function passed as prop
    } 
    // If not in edit mode, add a new image
    else if (imageTitle.trim() && imageURL.trim()) {
      await onAddImage(albumName, { title: imageTitle.trim(), url: imageURL.trim() }); // Call onAddImage with new image data
    }
    handleClear(); // Clear form fields after submission
  };

  // Clear form fields
  const handleClear = () => {
    setImageTitle("");
    setImageURL("");
  };

  return (
    <div className={styles.imageForm}>
      {/* Display the appropriate heading based on editMode */}
      <span>{editMode ? `Update Image ${editableImage?.title}` : `Add image to ${albumName}`}</span>
      
      <form onSubmit={handleSubmit}>
        {/* Input field for the image title */}
        <input
          required
          placeholder="Title"
          value={imageTitle}
          onChange={(e) => setImageTitle(e.target.value)}
        />
        {/* Input field for the image URL */}
        <input
          required
          placeholder="Image URL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
        />
        
        {/* Actions: Clear or submit buttons */}
        <div className={styles.actions}>
          <button type="button" onClick={handleClear}>
            Clear
          </button>
          <button type="submit">{editMode ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
};

export default ImageForm;
