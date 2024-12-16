import { useState, useEffect } from "react";
import styles from "./AlbumList.module.css";
import { photos } from "../../assets";
import AlbumForm from "../AlbumForm/AlbumForm";
import ImageList from "../ImageList/ImageList";
import { toast } from "react-toastify";
import { getAlbums, addAlbum, addImageToAlbum, updateImageInAlbum, getAlbumIdByName, deleteImageInAlbum} from "../../firestore";
import Spinner from "../Spinner/Spinner";

const AlbumList = ({ selectedAlbum, setSelectedAlbum }) => {
  const [showAlbumForm, setShowAlbumForm] = useState(false); // To toggle album form visibility
  const [albums, setAlbums] = useState([]); // Store fetched albums
  const [loading, setLoading] = useState(false); // State for loading indicator

  // Fetch albums from Firestore on component mount
  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true); // Show loading spinner while fetching
      try {
        const albumsData = await getAlbums(); // Fetch albums
        setAlbums(albumsData); // Update state with fetched albums
      } catch (error) {
        toast.error("Failed to fetch albums."); // Show error message on failure
      } finally {
        setLoading(false); // Hide loading spinner after fetching
      }
    };
    fetchAlbums(); // Call fetch function
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Toggle visibility of the album creation form
  const toggleAlbumForm = () => {
    setShowAlbumForm((prevState) => !prevState); // Toggle form visibility
  };

  // Handle album selection from the list
  const handleAlbumClick = async (albumName) => {
    try {
      const albumId = await getAlbumIdByName(albumName); // Get album ID by name
      if (albumId) {
        setSelectedAlbum(albumName); // Set selected album
        return albumId; // Return album ID
      } else {
        toast.error("Album not found."); // Show error if album not found
        return null;
      }
    } catch (error) {
      toast.error("Failed to fetch album details."); // Show error message on failure
      return null;
    }
  };

  // Handle adding a new album
  const handleAddAlbum = async (newAlbumName) => {
    setLoading(true); // Show loading spinner while adding album
    try {
      const albumId = await addAlbum(newAlbumName); // Add album to Firestore
      setAlbums((prevAlbums) => [
        { name: newAlbumName, images: [], id: albumId },
        ...prevAlbums,
      ]); // Update state with the new album
      toast.success("Album added successfully."); // Show success message
    } catch (error) {
      toast.error("Failed to add album."); // Show error message on failure
    } finally {
      setLoading(false); // Hide loading spinner after adding album
    }
  };

  // Handle adding an image to an album
  const handleAddImage = async (albumName, newImage) => {
    setLoading(true); // Show loading spinner while adding image
    try {
      const albumId = await handleAlbumClick(albumName); // Get album ID by name
      const albumsList = await getAlbums(); // Fetch all albums again
      const album = albumsList.find((album) => album.id === albumId); // Find album by ID
      const imageId = album.images.length; // Get the next image ID
      const updatedImages = [{ ...newImage, id: imageId }, ...album.images]; // Update image list

      await addImageToAlbum(albumId, newImage.title, newImage.url, imageId); // Add image to Firestore

      const updatedAlbums = albums.map((album) =>
        album.id === albumId
          ? { ...album, images: updatedImages }
          : album
      ); // Update album images in state
      setAlbums(updatedAlbums); // Update state with the new image
      toast.success("Image added successfully."); // Show success message
    } catch (error) {
      toast.error("Failed to add image."); // Show error message on failure
    } finally {
      setLoading(false); // Hide loading spinner after adding image
    }
  };

  // Handle updating an existing image
  const handleUpdateImage = async (albumName, updatedImage) => {
    setLoading(true); // Show loading spinner while updating image
    try {
      const albumId = await handleAlbumClick(albumName); // Get album ID by name
      await updateImageInAlbum(albumId, updatedImage); // Update image in Firestore

      setAlbums((prevAlbums) =>
        prevAlbums.map((album) =>
          album.id === albumId
            ? {
                ...album,
                images: album.images.map((img) =>
                  img.id === updatedImage.id ? updatedImage : img
                ),
              }
            : album
        )
      ); // Update image in state
      toast.success("Image updated successfully."); // Show success message
    } catch (error) {
      toast.error("Failed to update image."); // Show error message on failure
    } finally {
      setLoading(false); // Hide loading spinner after updating image
    }
  };

  // Handle deleting an image from an album
  const handleDeleteImage = async (albumName, imageToDelete) => {
    setLoading(true); // Show loading spinner while deleting image
    try {
      const albumId = await handleAlbumClick(albumName); // Get album ID by name
      const albumsList = await getAlbums(); // Fetch all albums again
      const album = albumsList.find((album) => album.id === albumId); // Find album by ID
      const updatedImages = album.images.filter((img) => img.id !== imageToDelete.id); // Filter out deleted image

      await deleteImageInAlbum(albumId, imageToDelete.id); // Delete image from Firestore

      const updatedAlbums = albums.map((album) =>
        album.id === albumId ? { ...album, images: updatedImages } : album
      ); // Update album images in state
      setAlbums(updatedAlbums); // Update state with the deleted image removed
      toast.success("Image deleted successfully."); // Show success message
    } catch (error) {
      toast.error("Failed to delete image."); // Show error message on failure
    } finally {
      setLoading(false); // Hide loading spinner after deleting image
    }
  };

  return (
    <>
      {loading ? (
        <Spinner /> // Show spinner while loading
      ) : selectedAlbum ? (
        <ImageList
          albumName={selectedAlbum}
          onAddImage={handleAddImage}
          onDeleteImage={handleDeleteImage}
          onUpdateImage={handleUpdateImage}
          images={albums.find((album) => album.name === selectedAlbum)?.images || []}
          onBack={() => setSelectedAlbum(null)} // Back button to unselect album
        />
      ) : (
        <>
          {showAlbumForm && <AlbumForm onAddAlbum={handleAddAlbum} />} {/*Show album form if toggled*/}
          <div>
            <div className={styles.top}>
              <h3>Your Albums</h3>
              <button
                className={showAlbumForm ? styles.active : "false"}
                onClick={toggleAlbumForm}
              >
                {showAlbumForm ? "Cancel" : "Add Album"} {/*Toggle album form visibility*/}
              </button>
            </div>
            <div className={styles.albumsList}>
              {albums.map((album, index) => (
                <div
                  key={index}
                  className={styles.album}
                  onClick={() => handleAlbumClick(album.name)}
                >
                  <img src={photos} alt="Album" />
                  <span>{album.name}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AlbumList;
