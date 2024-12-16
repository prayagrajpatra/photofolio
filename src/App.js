import './App.css';
import Navbar from './Components/Navbar/Navbar';
import AlbumList from './Components/AlbumList/AlbumList';
import styles from "./App.module.css";
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const resetToAlbumList = () => {
    setSelectedAlbum(null);
  };

  return (
    <div className="App">
      <ToastContainer />
      <Navbar onLogoClick={resetToAlbumList}/>
      <div className={styles.content}>
        <AlbumList  selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum}/>
      </div>
    </div>
  );
}

export default App;
