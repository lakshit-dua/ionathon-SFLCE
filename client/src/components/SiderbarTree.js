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

export default function SidebarTree(props) {
  const initial = {id: 'root',
  name: 'Parent',children: []};
  const [data, setData] = React.useState(initial);

  const getFile = () => {
    props.socket.emit("getPublicDir", "");
    props.socket.emit("getPublicDir", "client-folder");
  }

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
  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
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
      sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto', my: 5 }}
    >
      {renderTree(data)}
    </TreeView>
  );
}