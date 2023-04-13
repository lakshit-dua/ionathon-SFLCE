import { Fragment } from "react";
import FileDirectory from "../FileDirectory/FileDirectory";
import FilePreview from "../FilePreview/FilePreview";
import Navbar from "../Navbar/Navbar";
import "./AppContainer.css"


const AppContainer = (props) => {
  return (
    <div className="app-container">
      {props.socket ? (
          <Fragment>
            <Navbar user={props.user} ></Navbar>
            <div className="files-view-container">
              <FileDirectory socket={props.socket}></FileDirectory>
              <FilePreview socket={props.socket} />
            </div>
          </Fragment>
      ) : (
        <div>Not Connected</div>
      )
      }
    </div>
  )};
export default AppContainer;
