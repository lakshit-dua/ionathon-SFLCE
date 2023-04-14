import { Fragment } from "react";
import FileDirectory from "../FileDirectory/FileDirectory";
import FilePreview from "../FilePreview/FilePreview";
import Navbar from "../Navbar/Navbar";
import "./AppContainer.css"
import Dashboard from "../Dashboard";


const AppContainer = ({socket}) => {
  return (
    <div className="app-container">
      {socket ? (
          <Fragment>
            {/* <Navbar user={props.user} ></Navbar> */}
            <Dashboard socket={socket} />
            {/* <div className="files-view-container">
              <FileDirectory socket={props.socket}></FileDirectory>
              <FilePreview socket={props.socket} />
            </div> */}
          </Fragment>
      ) : (
        <div>Not Connected</div>
      )
      }
    </div>
  )};
export default AppContainer;
