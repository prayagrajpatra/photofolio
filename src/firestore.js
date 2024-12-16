import {collection,addDoc,getDoc,getDocs,doc,updateDoc,query,where,orderBy} from "firebase/firestore";
import db from "./firebase"; 

// Reference to the Firestore "albums" collection
const albumsCollection = collection(db, "albums");

/**
 * Adds a new album to the Firestore database.
 */
export const addAlbum = async (albumName) => {
  try {
    // Album structure with name and an empty array for images
    const newAlbum = { name: albumName, images: [] };
    
    // Adding the new album to Firestore
    const docRef = await addDoc(albumsCollection, newAlbum);
    
    // Return the ID of the newly created album
    return docRef.id; 
  } catch (error) {
    // Logging any errors encountered during album creation
    console.error("Error adding album: ", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Fetches all albums from the Firestore database, ordered by album name.
 */
export const getAlbums = async () => {
  try {
    // Creating a query to fetch albums ordered by name
    const q = query(albumsCollection, orderBy("name"));
    
    // Executing the query to get the album documents
    const snapshot = await getDocs(q);
    
    // Mapping the snapshot to return albums with their data and IDs
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); 
  } catch (error) {
    // Logging any errors encountered during album fetching
    console.error("Error fetching albums: ", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Fetches the ID of an album by its name.
 * @param {string} albumName - The name of the album to find.
 * @returns {string|null} - The ID of the album if found, or null if not found.
 */
export const getAlbumIdByName = async (albumName) => {
  try {
    // Creating a query to find the album by name
    const q = query(albumsCollection, where("name", "==", albumName));
    
    // Executing the query to get the album document(s)
    const snapshot = await getDocs(q);

    // If no album is found, log an error and return null
    if (snapshot.empty) {
      console.error("No album found with the name:", albumName);
      return null; 
    }

    // Retrieve the first document from the snapshot and return its ID
    const albumDoc = snapshot.docs[0]; 
    return albumDoc.id; 
  } catch (error) {
    // Logging any errors encountered during album lookup by name
    console.error("Error fetching album by name:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Adds a new image to an existing album.
 */
export const addImageToAlbum = async (albumId, imageTitle, imageUrl, imageId) => {
  try {
    // Reference to the specific album document
    const albumRef = doc(db, "albums", albumId);
    
    // Fetching the album document to ensure it exists
    const albumSnapshot = await getDoc(albumRef);

    // If the album doesn't exist, log an error and exit the function
    if (!albumSnapshot.exists()) {
      console.error("Album not found with ID:", albumId);
      return;
    }

    // Get the album's data and prepare the new image to be added
    const albumData = albumSnapshot.data();
    const newImage = { id: imageId, title: imageTitle, url: imageUrl };

    // Update the album's images array by adding the new image
    const updatedImages = [...(albumData.images || []), newImage];

    // Updating the album document with the new images array
    await updateDoc(albumRef, { images: updatedImages });
    console.log("Image added successfully");
  } catch (error) {
    // Logging any errors encountered during image addition
    console.error("Error adding image to album: ", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Updates an image in an existing album.
 */
export const updateImageInAlbum = async (albumId, updatedImage) => {
  try {
    // Reference to the specific album document
    const albumRef = doc(db, "albums", albumId);

    // Fetching the album document to retrieve its current images
    const albumSnapshot = await getDoc(albumRef);
    const albumData = albumSnapshot.data();

    // Update the image in the album's images array
    const updatedImages = albumData.images.map((img) =>
      img.id === updatedImage.id ? updatedImage : img
    );

    // Updating the album document with the modified images array
    await updateDoc(albumRef, { images: updatedImages });
    console.log("Image updated successfully");
  } catch (error) {
    // Logging any errors encountered during image update
    console.error("Error updating image: ", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Deletes an image from an album.
 */
export const deleteImageInAlbum = async (albumId, imageId) => {
  try {
    // Reference to the specific album document
    const albumRef = doc(db, "albums", albumId);

    // Fetching the album document to retrieve its current images
    const albumSnapshot = await getDoc(albumRef);

    // If the album doesn't exist, log an error and exit the function
    if (!albumSnapshot.exists()) {
      console.error("Album not found with ID:", albumId);
      return;
    }

    // Get the album's data and filter out the image to be deleted
    const albumData = albumSnapshot.data();
    const updatedImages = albumData.images.filter((img) => img.id !== imageId);

    // Updating the album document with the modified images array
    await updateDoc(albumRef, { images: updatedImages });

    // Log success message after image is deleted
    console.log("Image deleted successfully.");
  } catch (error) {
    // Logging any errors encountered during image deletion
    console.error("Error deleting image in album: ", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
