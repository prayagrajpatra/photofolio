import { useState } from "react";
import styles from "./ImageList.module.css";
import { back, edit, trash, search, clear } from "../../assets";
import ImageForm from "../ImageForm/ImageForm";
import Carousel from "../Carousel/Carousel";

// ImageList Component that manages displaying images, handling search, editing, and deleting images.
const ImageList = ({ albumName, onAddImage, onDeleteImage, onUpdateImage, images, onBack }) => {
    const [showImageForm, setShowImageForm] = useState(false); // Toggles the display of the ImageForm
    const [hoveredIndex, setHoveredIndex] = useState(null); // Tracks the index of the hovered image for hover effects
    const [searchActive, setSearchActive] = useState(false); // Determines if the search input is active
    const [searchQuery, setSearchQuery] = useState(""); // Holds the current search query
    const [showCarousel, setShowCarousel] = useState(false); // Toggles the display of the carousel
    const [currentImageIndex, setCurrentImageIndex] = useState(null); // Stores the index of the currently selected image
    const [editMode, setEditMode] = useState(false); // Determines if the component is in edit mode
    const [editableImage, setEditableImage] = useState(null); // Stores the image to be edited

    // Toggles the visibility of the image form for adding or editing images
    const toggleImageForm = () => {
        if (showImageForm) {
            setEditMode(false);
            setEditableImage(null);
        }
        setShowImageForm(prevState => !prevState);
    };

    // Handles mouse hover on image to show the edit and delete options
    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    // Resets the hovered index when mouse leaves an image
    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    // Activates search mode when the search icon is clicked
    const handleSearchIconClick = () => {
        setSearchActive(true);
    };

    // Clears the search query and deactivates search mode
    const handleClearSearch = () => {
        setSearchActive(false);
        setSearchQuery("");
    };

    // Opens the carousel to view the selected image
    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        setShowCarousel(true);
    };

    // Closes the carousel view
    const closeCarousel = () => {
        setShowCarousel(false);
        setCurrentImageIndex(null);
    };

    // Handles the click event for editing an image
    const handleEditClick = (image, event) => {
        event.stopPropagation(); // Prevents the image click event from firing
        setEditableImage(image); 
        setEditMode(true); 
        setShowImageForm(true); // Opens the form in edit mode
    };

    // Filters the images based on the search query (case-insensitive)
    const filteredImages = images.filter(image =>
        image.title && image.title.trim().toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Conditional rendering for the image form */}
            {showImageForm && (
                <ImageForm
                    albumName={albumName}
                    onAddImage={onAddImage}
                    onUpdateImage={onUpdateImage} 
                    editMode={editMode}
                    editableImage={editableImage}
                />
            )}

            <div className={styles.top}>
                {/* Back button to navigate to previous view */}
                <span onClick={onBack}>
                    <img src={back} alt="Back" style={{ cursor: "pointer" }} />
                </span>
                <h3>
                    {images.length === 0 ? "No images found in the album." : `Images in ${albumName}`}
                </h3>
                {/* Search bar display */}
                {images.length > 0 && (
                    <div className={styles.search}>
                        {searchActive ? (
                            <>
                                <input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <img
                                    src={clear}
                                    alt="Clear"
                                    onClick={handleClearSearch}
                                    style={{ cursor: "pointer" }}
                                />
                            </>
                        ) : (
                            <img
                                src={search}
                                alt="Search"
                                onClick={handleSearchIconClick}
                                style={{ cursor: "pointer" }}
                            />
                        )}
                    </div>
                )}
                {/* Button to toggle between showing and hiding the image form */}
                <button
                    className={showImageForm ? styles.active : ""}
                    onClick={toggleImageForm}
                >
                    {showImageForm ? "Cancel" : "Add Image"}
                </button>
            </div>

            {/* Carousel for viewing selected image */}
            {showCarousel && currentImageIndex !== null && (
                <Carousel
                    images={images}
                    onClose={closeCarousel}
                    currentImageIndex={currentImageIndex}
                />
            )}

            {/* List of images with hover effects for edit and delete */}
            <div className={styles.imageList}>
                {filteredImages.map((image, index) => (
                    <div
                        key={index}
                        className={styles.image}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleImageClick(index)}
                    >
                        <div
                            className={`${styles.update} ${hoveredIndex === index ? styles.active : ""}`}
                            onClick={(e) => handleEditClick(image, e)}
                        >
                            <img src={edit} alt="Edit" />
                        </div>

                        <div
                            className={`${styles.delete} ${hoveredIndex === index ? styles.active : ""}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteImage(albumName, image);
                            }}
                        >
                            <img src={trash} alt="Delete" />
                        </div>

                        <img src={image.url} alt={image.title} />
                        <span>{image.title}</span>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ImageList;
