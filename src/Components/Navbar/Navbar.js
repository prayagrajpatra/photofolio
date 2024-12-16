import styles from "./Navbar.module.css"
import { logo } from "../../assets";

const Navbar = ({ onLogoClick }) => {    
    return (
    <div className={styles.navbar} onClick={onLogoClick} style={{ cursor: "pointer" }}>
        <div className={styles.navbar_logo}>
            <img src={logo} alt="logo"></img>
            <span>PhotoFolio</span>
        </div>
    </div>
  );
};

export default Navbar;
  