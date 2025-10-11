import { TreeView, createTreeCollection } from "@ark-ui/react/tree-view";
import {
  ChevronRight,
  File,
  FolderClosed,
  FolderOpen,
  Plus,
  FolderPlus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type TreeNode = {
  id: string;
  name: string;
  children?: TreeNode[];
};

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { id: "ROOT", name: "", children: [] };

  for (const fullPath of paths) {
    const parts = fullPath.split("/").filter(Boolean); // split path into segments
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1; // last item is file

      // look for an existing child with same name
      let node = current.children?.find((child) => child.name === part);

      if (!node) {
        node = {
          id: parts.slice(0, i + 1).join("/"),
          name: part,
          ...(isFile ? {} : { children: [] }),
        };
        current.children!.push(node);
      }

      if (!isFile) {
        current = node;
      }
    }
  }

  return root;
}

interface Node {
  id: string;
  name: string;
  children?: Node[] | undefined;
}

const TreeViewBasic = ({ allFilesAndFolders, setSelectedPath }: any) => {
  const [treeData, setTreeData] = useState<Node>(buildTree(allFilesAndFolders));
  useEffect(() => {
    setTreeData(buildTree(allFilesAndFolders));
  }, [allFilesAndFolders]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [addType, setAddType] = useState<"file" | "folder">("file");
  const [selectedParentId, setSelectedParentId] = useState<string>("ROOT");
  const [itemName, setItemName] = useState<string>("");

  const collection = createTreeCollection<Node>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: treeData,
  });

  const generateId = () =>
    `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const getAllFolders = (
    node: Node,
    path = ""
  ): Array<{ id: string; name: string; path: string }> => {
    const folders: Array<{ id: string; name: string; path: string }> = [];

    if (node.id === "ROOT") {
      folders.push({ id: "ROOT", name: "Root", path: "/" });
    } else if (node.children) {
      const currentPath = path ? `${path}/${node.name}` : node.name;
      folders.push({ id: node.id, name: node.name, path: currentPath });
    }

    if (node.children) {
      node.children.forEach((child) => {
        if (child.children) {
          const currentPath =
            node.id === "ROOT" ? "" : path ? `${path}/${node.name}` : node.name;
          folders.push(...getAllFolders(child, currentPath));
        }
      });
    }

    return folders;
  };

  const showAddDialog = (type: "file" | "folder") => {
    setAddType(type);
    setSelectedParentId("ROOT");
    setItemName("");
    setShowLocationDialog(true);
  };

  const addItem = () => {
    if (!itemName.trim()) {
      return;
    }

    const newItem: Node =
      addType === "folder"
        ? {
            id: generateId(),
            name: itemName.trim(),
            children: [],
          }
        : {
            id: generateId(),
            name: itemName.trim(),
          };

    const addToNode = (node: Node): Node => {
      if (node.id === selectedParentId) {
        return {
          ...node,
          children: [...(node.children || []), newItem],
        };
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map((child) => addToNode(child)),
        };
      }

      return node;
    };

    setTreeData((prev) => addToNode(prev));
    setShowLocationDialog(false);
    setItemName("");
  };

  const deleteNode = (nodeId: string) => {
    // const deleteFromNode = (node: Node): Node => {
    //   if (node.children) {
    //     return {
    //       ...node,
    //       children: node.children
    //         .filter((child) => child.id !== nodeId)
    //         .map((child) => deleteFromNode(child)),
    //     };
    //   }
    //   return node;
    // };
    // setTreeData((prev) => deleteFromNode(prev));
    // setSelectedNodeId(null);
    // setSelectedPath("");
  };

  const getNodePath = (
    nodeId: string,
    node: Node = treeData,
    currentPath = ""
  ): string => {
    if (node.id === nodeId) {
      return node.id === "ROOT"
        ? "/"
        : currentPath
        ? `${currentPath}/${node.name}`
        : node.name;
    }

    if (node.children) {
      for (const child of node.children) {
        const newPath =
          node.id === "ROOT"
            ? ""
            : currentPath
            ? `${currentPath}/${node.name}`
            : node.name;
        const result = getNodePath(nodeId, child, newPath);
        if (result) return result;
      }
    }

    return "";
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    const path = getNodePath(nodeId);
    setSelectedPath(path);
  };

  const TreeNode = (props: TreeView.NodeProviderProps<Node>) => {
    const { node, indexPath } = props;
    return (
      <TreeView.NodeProvider key={node.id} node={node} indexPath={indexPath}>
        {node.children ? (
          <TreeView.Branch>
            <TreeView.BranchControl
              className="group flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-light transition-all duration-200 "
              onClick={() => handleNodeClick(node.id)}
            >
              {/* <TreeView.BranchIndicator className="flex h-4 w-4 shrink-0 items-center justify-center">
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[state=open]:text-slate-600" />
              </TreeView.BranchIndicator> */}
              <TreeView.BranchText className="flex items-center gap-2.5  group-data-[state=open]:text-white dark:group-data-[state=open]:text-slate-100">
                <FolderClosed className="h-4 w-4 text-blue-500 group-data-[state=open]:hidden" />
                <FolderOpen className="hidden h-4 w-4 text-blue-600 group-data-[state=open]:block" />
                <span className="font-medium">{node.name}</span>
              </TreeView.BranchText>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                title="Delete folder"
              >
                <Trash2 className="h-3 w-3 text-red-500" />
              </button>
            </TreeView.BranchControl>
            <TreeView.BranchContent className="ml-4 mt-1 space-y-1 border-l-[0.1px] border-white/30  dark:border-slate-700/60">
              <TreeView.BranchIndentGuide />
              {node.children.map((child, index) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  indexPath={[...indexPath, index]}
                />
              ))}
            </TreeView.BranchContent>
          </TreeView.Branch>
        ) : (
          <TreeView.Item
            className="group flex w-full items-center gap-2  px-3 py-2 text-sm font-extralight transition-all duration-200  dark:hover:bg-slate-800/50 data-[selected]:bg-blue-900/30
             dark:data-[selected]:bg-blue-900/30 data-[selected]:text-blue-700 dark:data-[selected]:text-blue-300 data-[selected]:shadow-sm data-[selected]:ring-1 data-[selected]:ring-blue-200 dark:data-[selected]:ring-blue-800/30"
            onClick={() => handleNodeClick(node.id)}
          >
            <TreeView.ItemText className="flex items-center gap-2.5  group-data-[selected]:text-white ">
              <File className="h-4 w-4 group-data-[selected]:text-white" />
              <span>{node.name}</span>
            </TreeView.ItemText>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
              title="Delete file"
            >
              <Trash2 className="h-3 w-3 text-red-500" />
            </button>
          </TreeView.Item>
        )}
      </TreeView.NodeProvider>
    );
  };

  return (
    <div className="w-[200px] mx-auto">
      <TreeView.Root collection={collection} className="w-full">
        {/* <div className="flex items-center justify-between mb-4">
          <TreeView.Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Project Files
          </TreeView.Label>
          <div className="flex gap-2">
            <button
              onClick={() => showAddDialog("folder")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
              title="Add folder"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              Folder
            </button>
            <button
              onClick={() => showAddDialog("file")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-lg transition-colors"
              title="Add file"
            >
              <Plus className="h-3.5 w-3.5" />
              File
            </button>
          </div>
        </div> */}
        <TreeView.Tree className="space-y-1 rounded-xl  text-white   dark:border-slate-700 dark:bg-slate-900">
          {collection.rootNode.children?.map((node, index) => (
            <TreeNode key={node.id} node={node} indexPath={[index]} />
          ))}
        </TreeView.Tree>

        {/* {selectedPath && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Selected Path:
            </div>
            <div className="text-sm font-mono text-slate-900 dark:text-slate-100 break-all">
              {selectedPath}
            </div>
          </div>
        )} */}
      </TreeView.Root>

      {showLocationDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className=" dark:bg-slate-800 rounded-lg p-6 w-96 max-w-[90vw] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibol ">
                Add {addType === "folder" ? "Folder" : "File"}
              </h3>
              <button
                onClick={() => setShowLocationDialog(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium   mb-2">
                {addType === "folder" ? "Folder" : "File"} name:
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={
                  addType === "folder" ? "Enter folder name" : "Enter file name"
                }
                className="w-full p-2 border border-slate-300   placeholder-slate-400 dark:placeholder-slate-500"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-mediummb-2">
                Select location:
              </label>
              <select
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                className="w-full p-2 border border-slate-300  rounded-md  dark:bg-slate-700 text-white dark:text-slate-100"
              >
                {getAllFolders(treeData).map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.path}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowLocationDialog(false)}
                className="px-4 py-2 text-sm font-medium   hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                disabled={!itemName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                Add {addType === "folder" ? "Folder" : "File"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeViewBasic;
