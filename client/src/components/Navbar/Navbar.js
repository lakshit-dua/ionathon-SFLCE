// import { useRef } from "react";
// import SearchOutlined from "@mui/icons-material/SearchOutlined";
// import ArrowForward from "@mui/icons-material/ArrowForward";
// import Logout from "@mui/icons-material/Logout";
// import "./Navbar.css";

// const Navbar = () => {
//     const searchFolderRef = useRef();
//     const searchTextRef = useRef();

//     const logoutButtonHandler = () => {

//     };

//     const handleSearchTextClick = () => {

//     };

//     const handleClearSelection = () => {

//     };

//   return (
//     <header>
//         <nav className="navbar-container">
//             <h1>Debug Console</h1>
//             <div className="search-text-container">
//                 <input className="search-text" type="text" ref={searchTextRef} placeholder="Search Text"></input>
//                 <SearchOutlined className="text-button" onClick={handleSearchTextClick}/>
//             </div>
//             <div className="search-text-container">
//                 <input className="search-text" type="text" ref={searchFolderRef} placeholder="Select Folder"></input>
//                 <ArrowForward className="text-button" onClick={handleClearSelection}/>
//             </div>
//             <button className="logout-button" onClick={logoutButtonHandler}>
//                 Logout <Logout/></button>
//         </nav>
//     </header>
//   );
// };

// export default Navbar;

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Debug Console
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
