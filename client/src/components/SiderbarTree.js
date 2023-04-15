import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

const data = {
  id: 'root',
  name: 'Parent',
  children: [
    {
      id: '1',
      name: 'Child - 1',
    },
    {
      id: '3',
      name: 'Child - 3',
      children: [
        {
          id: '4',
          name: 'Child - 4',
        },
      ],
    },
  ],
};

// const getNodeRef = (dataRef, nodeId) => {
//   if (dataRef.id === nodeId) {
//     return dataRef
//   } else if(dataRef.children) {
//     dataRef.children.forEach(child => {
//       return (ref || getNodeRef(child, nodeId));
//     });
//   }
// }

const findItemNested = (arr, itemId, nestingKey) => (
  arr.reduce((a, item) => {
    if (a) return a;
    if (item.id === itemId) return item;
    if (item[nestingKey]) return findItemNested(item[nestingKey], itemId, nestingKey)
  }, null)
);

export default function SidebarTree(props) {
  const initial = {id: 'root',
  name: 'Parent',children: []};
  const [data, setData] = React.useState(initial);

  React.useEffect(() => {
    props.socket.emit("getPublicDir", "");
    const messageListener = (message) => {
        setData(() => {
          console.log("new", message.directory)
          return message.directory;
      });
    };  
    props.socket.on('getPublicDirResp', messageListener);

    return () => {
      props.socket.off('getPublicDirResp', messageListener);
    };
  }, [props.socket]);

  const [selectedFile, setSelectedFile] = React.useState("");

  React.useEffect(() => {
    if (props.socket) {      
      props.socket.emit("getArchiveList", selectedFile);
      const messageListener = (message) => {
          setData((prev) => {
            const ref = findItemNested(prev.children, message.nodeId, "children");
            const childEntries = message.entries.map((entry) => { return {name: entry.name, id: entry.id}});
            ref.children = childEntries;
            console.log("new", ref, message.entries, childEntries)
            return JSON.parse(JSON.stringify(prev));
        });
      };  
      props.socket.on('getArchiveListResp', messageListener);
  
      return () => {
        props.socket.off('getArchiveListResp', messageListener);
      };
    }
  }, [selectedFile]);

  const handleSelectionChange = (event, nodeId) => {
    if(nodeId.includes("tar") || nodeId.includes("tz") || nodeId.includes("7z") || nodeId.includes("zip")) {
      setSelectedFile(nodeId || "");
    } else if(nodeId.includes(".txt") || nodeId.includes(".log")) {
      props.fileSelected(nodeId);
      props.setSearchResults(false);
    }
  }


  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name} >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={handleSelectionChange}
      sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto', my: 5 }}
    >
      {renderTree(data)}
    </TreeView>
  );
}