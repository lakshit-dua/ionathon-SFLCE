import * as React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useWindowScrollPositions } from "./useWindowScrollPositions";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SidebarTree from "./SiderbarTree";
import Navbar from "./Navbar/Navbar";
import { Button, Grid, IconButton, InputBase, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const drawerWidth = 400;

const content = [
  "llskdjldkjglfjlskdjldkjglfjlskdjldkjglfjlskdjldkjglskdjldkjglfjlskdjldkjglfjlskdlskdjldkjglfjlskdjldkjglfjlskdjldkjglfjlskdjldkjglfjlskdjldkjglfjjldkjglfjlskdjldkjglfjlskdjldkjglfjlskdjldkjglfjlskdjldkjglfjlfjlskdjldkjglfjlskdjldkjglfjlskdjldkjglfjlskdjldkjglfjskdjldkjglfj",
  "ldkfjgldfjgljfdlkgjlkfdjg",
  "ldkfjgldkjfglkjdg",
  "dlkfjgldkjfg",
  "lskdjldkjglfj",
  "ldkfjgldfjgljfdlkgjlkfdjg",
  "ldkfjgldkjfglkjdg",
  "dlkfjgldkjfg",
  "lskdjldkjglfj",
  "ldkfjgldfjgljfdlkgjlkfdjg",
  "ldkfjgldkjfglkjdg",
  "dlkfjgldkjfg",
  "lskdjldkjglfj",
  "lskdjldkjglfj",
  "lskdjldkjglfj",
  "lskdjldkjglfj",
  "lskdjldkjglfj",
  "lskdjldkjglfj",
  "lskdjldkjglfj",
  "lskdjldkjglfj",
  "lskdjldkjglfj",
  "ldkfjgldfjgljfdlkgjlkfdjg",
  "ldkfjgldkjfglkjdg",
  "dlkfjgldkjfg",
  "ldkfjgldfjgljfdlkgjlkfdjg",
  "ldkfjgldkjfglkjdg",
  "dlkfjgldkjfg",
  "ldkfjgldfjgljfdlkgjlkfdjg",
  "ldkfjgldkjfglkjdg",
  "dlkfjgldkjfg",
  "ldkfjgldfjgljfdlkgjlkfdjg",
  "ldkfjgldkjfglkjdg",
  "dlkfjgldkjfg",
  "ldkfjgldfjgljfdlkgjlkfdjg",
  "ldkfjgldkjfglkjdg",
  "dlkfjgldkjfg",
  "ldkfjgldfjgljfdlkgjlkfdjg",
  "ldkfjgldkjfglkjdg",
  "dlkfjgldkjfg",
  "ldkfjgldfjgljfdlkgjlkfdjg",
  "ldkfjgldkjfglkjdg",
  "dlkfjgldkjfg",
  "ldkfjgldfjgljfdlkgjlkfdjg",
  "ldkfjgldkjfglkjdg",
  "dlkfjgldkjfg",
  "ldkfjgldfjgljfdlkgjlkfdjg",
  "ldkfjgldkjfglkjdg",
  "dlkfjgldkjfg",
];

const Dashboard = ({ socket }) => {
  const { scrollX, scrollY } = useWindowScrollPositions();
  const [initialIndex, setInitialIndex] = useState(0);
  const [finalIndex, setFinalIndex] = useState(50);
  const [addition, setAddition] = useState(0);
  const [value] = useDebounce(addition, 1000);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (scrollY) setAddition((addition) => Math.floor(scrollY / 25));
  }, [scrollY]);

  useEffect(() => {
    setInitialIndex((initialIndex) => 0 + addition);
    setFinalIndex((finalIndex) => 50 + addition);
  }, [addition]);

  console.log("Scroll position is", scrollX, scrollY);
  console.log("InitialIndex", addition, initialIndex, finalIndex);
  console.log(value);
  console.log(search);
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            Debug Console
          </Typography>
          {/* <TextField id="outlined-basic" label="Outlined secondary" color="secondary" variant="outlined" sx={{width: 600}} focused /> */}
          <InputBase
            sx={{
              marginLeft: 10,
              flex: 1,
              border: 1,
              borderColor: "white",
              padding: 1,
              borderRadius: 1,
            }}
            placeholder="Search a keyword..."
            inputProps={{ "aria-label": "search a keyword..." }}
            onChange={(event) => setSearch(event.target.value)}
            value={search}
          />
          <IconButton type="button" aria-label="search" >
            <SearchIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            link/to/file/path
          </Typography>
        </Toolbar>
      </AppBar>
      {/* <Navbar /> */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <SidebarTree socket={socket} />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <div>
          {content.map((c) => (
            <div>{c}</div>
          ))}
          {/* <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Accordion 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Accordion 2</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion> */}
        </div>
      </Box>
    </Box>
  );
};

export default Dashboard;
