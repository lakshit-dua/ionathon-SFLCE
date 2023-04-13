import { useRef } from "react";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Logout from "@mui/icons-material/Logout";
import "./Navbar.css";

const Navbar = () => {
    const searchFolderRef = useRef();
    const searchTextRef = useRef();

    const logoutButtonHandler = () => {

    };

    const handleSearchTextClick = () => {

    };

    const handleClearSelection = () => {

    };

  return (
    <header>
        <nav className="navbar-container">
            <h1>Debug Console</h1>
            <div className="search-text-container">
                <input className="search-text" type="text" ref={searchTextRef} placeholder="Search Text"></input>
                <SearchOutlined className="text-button" onClick={handleSearchTextClick}/>
            </div>
            <div className="search-text-container">
                <input className="search-text" type="text" ref={searchFolderRef} placeholder="Select Folder"></input>
                <ArrowForward className="text-button" onClick={handleClearSelection}/>
            </div>
            <button className="logout-button" onClick={logoutButtonHandler}>
                Logout <Logout/></button>
        </nav>
    </header>
  );
};

export default Navbar;
