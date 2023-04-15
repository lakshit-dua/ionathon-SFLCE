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
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  InputBase,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";

const searchFileText = {
  term: "amet",
  results: {
    log_txt: [
      [
        {
          line: "1",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nisl dolor, sagittis ut sollicitudin in, dapibus ut ex. Sed tincidunt turpis eu nulla posuere congue. Mauris interdum sed turpis sed porttitor. Nam a suscipit ex, nec vulputate felis. Sed vel est ut justo sollicitudin dapibus eget quis nunc. Sed mauris lectus, pulvinar vel sollicitudin a, condimentum sit amet justo. Morbi ac leo ligula. Etiam pellentesque et quam vitae luctus. In finibus tortor velit, quis varius quam tincidunt a. Sed consequat quis risus at blandit. Vivamus non lorem orci. Cras erat sapien, malesuada id odio in, pellentesque blandit sapien. Mauris sagittis, dui maximus tempus vehicula, nisl lectus mattis quam, sit amet porta sem neque eget velit. Nunc eu suscipit justo. Sed vulputate, mauris non iaculis aliquet, libero neque facilisis sem, id rhoncus arcu purus eu lectus. Integer sit amet sem quis nisl placerat consectetur.",
          index: "22",
        },
      ],
      [
        {
          line: "3",
          text: "Maecenas nunc tellus, suscipit non ullamcorper ut, finibus sed leo. Mauris mi neque, vulputate eget ex vel, maximus suscipit risus. Phasellus nunc justo, scelerisque quis mi vehicula, maximus luctus tellus. Cras et dignissim leo, a aliquet arcu. Donec dapibus, turpis tincidunt aliquet tincidunt, velit ante blandit lacus, at dictum dolor urna quis metus. Nullam at tempus urna. Maecenas malesuada mi tortor. Nullam purus mauris, maximus a convallis eget, vulputate quis ante. Sed maximus feugiat lorem, quis pharetra orci sollicitudin sed. Pellentesque molestie, sem nec posuere lobortis, augue felis lacinia diam, sed porta nulla justo nec urna. Quisque tortor nisl, eleifend id imperdiet sit amet, placerat non neque.",
          index: "695",
        },
      ],
      [
        {
          line: "7",
          text: "Nulla non velit at nisi faucibus malesuada nec id turpis. Pellentesque tristique tempor elit, id aliquam enim vulputate sit amet. Duis volutpat erat semper eleifend suscipit. Vestibulum eget odio dignissim, imperdiet quam sit amet, ultrices sem. Proin nec sem vulputate, consectetur lectus vitae, aliquet odio. Nulla viverra consequat risus vel accumsan. Suspendisse lacinia dolor non feugiat rutrum. Quisque commodo tellus quam, vel aliquam arcu efficitur in. Integer feugiat mattis dignissim. Nam convallis mauris sit amet nisi elementum, vitae auctor leo egestas. Aenean ac lectus vitae leo hendrerit porta sit amet luctus augue. Nullam varius dolor at iaculis congue. Proin ante ligula, dignissim et congue sit amet, elementum quis nulla. Cras congue posuere mauris, ultricies scelerisque dolor placerat sed. Aenean euismod dolor nec vulputate cursus. Mauris magna nulla, consectetur vitae dignissim vel, iaculis in mi.",
          index: "124",
        },
      ],
    ],
    test_file: [
      [
        {
          line: "1",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nisl dolor, sagittis ut sollicitudin in, dapibus ut ex. Sed tincidunt turpis eu nulla posuere congue. Mauris interdum sed turpis sed porttitor. Nam a suscipit ex, nec vulputate felis. Sed vel est ut justo sollicitudin dapibus eget quis nunc. Sed mauris lectus, pulvinar vel sollicitudin a, condimentum sit amet justo. Morbi ac leo ligula. Etiam pellentesque et quam vitae luctus. In finibus tortor velit, quis varius quam tincidunt a. Sed consequat quis risus at blandit. Vivamus non lorem orci. Cras erat sapien, malesuada id odio in, pellentesque blandit sapien. Mauris sagittis, dui maximus tempus vehicula, nisl lectus mattis quam, sit amet porta sem neque eget velit. Nunc eu suscipit justo. Sed vulputate, mauris non iaculis aliquet, libero neque facilisis sem, id rhoncus arcu purus eu lectus. Integer sit amet sem quis nisl placerat consectetur.",
          index: "22",
        },
      ],
      [
        {
          line: "3",
          text: "Maecenas nunc tellus, suscipit non ullamcorper ut, finibus sed leo. Mauris mi neque, vulputate eget ex vel, maximus suscipit risus. Phasellus nunc justo, scelerisque quis mi vehicula, maximus luctus tellus. Cras et dignissim leo, a aliquet arcu. Donec dapibus, turpis tincidunt aliquet tincidunt, velit ante blandit lacus, at dictum dolor urna quis metus. Nullam at tempus urna. Maecenas malesuada mi tortor. Nullam purus mauris, maximus a convallis eget, vulputate quis ante. Sed maximus feugiat lorem, quis pharetra orci sollicitudin sed. Pellentesque molestie, sem nec posuere lobortis, augue felis lacinia diam, sed porta nulla justo nec urna. Quisque tortor nisl, eleifend id imperdiet sit amet, placerat non neque.",
          index: "695",
        },
      ],
      [
        {
          line: "7",
          text: "Nulla non velit at nisi faucibus malesuada nec id turpis. Pellentesque tristique tempor elit, id aliquam enim vulputate sit amet. Duis volutpat erat semper eleifend suscipit. Vestibulum eget odio dignissim, imperdiet quam sit amet, ultrices sem. Proin nec sem vulputate, consectetur lectus vitae, aliquet odio. Nulla viverra consequat risus vel accumsan. Suspendisse lacinia dolor non feugiat rutrum. Quisque commodo tellus quam, vel aliquam arcu efficitur in. Integer feugiat mattis dignissim. Nam convallis mauris sit amet nisi elementum, vitae auctor leo egestas. Aenean ac lectus vitae leo hendrerit porta sit amet luctus augue. Nullam varius dolor at iaculis congue. Proin ante ligula, dignissim et congue sit amet, elementum quis nulla. Cras congue posuere mauris, ultricies scelerisque dolor placerat sed. Aenean euismod dolor nec vulputate cursus. Mauris magna nulla, consectetur vitae dignissim vel, iaculis in mi.",
          index: "124",
        },
      ],
    ],
  },
};

const SearchView = (props) => {
  const [searchFileText, setSearchFileText] = useState(null);

  useEffect(() => {
    if (props?.search?.length > 0 && props?.fileId?.length > 0) {
      props.socket.emit("search", "", props.fileId, props.search);
      const messageListener = (message) => {
        console.log(message.searchResult);
        setSearchFileText(JSON.parse(message.searchResult));
        props.socket.off("searchResp", messageListener);
      };
      props.socket.on("searchResp", messageListener);
    }
  }, [props.search, props.socket, props.fileId]);

  return (
    <div>
      {!searchFileText ? (
        <>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            <Grid item xs={3} style={{display: "flex", alignItems: "center", justifyContent: "center", gap:"10px"}}>
              <CircularProgress /> Processing Files...
            </Grid>
          </Grid>
        </>
      ) : (
        Object.keys(searchFileText.results).map((file, index) => {
          return (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{file}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {searchFileText.results[file].map((code, index) => {
                  return (
                    <Card sx={{ minWidth: 275, my: 5 }} key={index}>
                      <CardContent>
                        <Typography variant="body2">
                          {/* {code[0].text.replace(
                              new RegExp(searchFileText.term, "gi"),
                              (match) => {
                                return (
                                  <Chip
                                    label={match}
                                    color="primary"
                                    variant="outlined"
                                  />
                                );
                              }
                            )} */}
                          {code[0].text}
                        </Typography>
                      </CardContent>
                    </Card>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </div>
  );
};

export default SearchView;
