import "./FileDirectory.css";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useState } from "react";

const data = {
  id: "root",
  name: "Parent",
  children: [
    {
      id: "1",
      name: "Child - 1",
    },
    {
      id: "3",
      name: "Child - 3",
      children: [
        {
          id: "4",
          name: "Child - 4",
        },
      ],
    },
  ],
};

const FileDirectory = () => {
  const [hidden, setHidden] = useState(false);
  const handleExpandButton = () => {
    setHidden((prev) => !prev);
  };
  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <div className="file-directory">
      {!hidden && (
        <div className="file-directory-tree">
             <TreeView
                aria-label="rich object"
                defaultCollapseIcon={<ExpandMore />}
                defaultExpanded={["root"]}
                defaultExpandIcon={<ChevronRight />}
                sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
                >
                {renderTree(data)}
            </TreeView>
        </div>
      )}
      <button className="expand-button" onClick={handleExpandButton}>
        {hidden && <ArrowForwardIosIcon />}
        {!hidden && <ArrowBackIosIcon />}
      </button>
    </div>
  );
};

export default FileDirectory;
