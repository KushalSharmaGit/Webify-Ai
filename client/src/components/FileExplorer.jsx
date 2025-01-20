import React, { useState } from "react";
import { 
  FolderIcon, 
  FileIcon, 
  ChevronDownIcon, 
  ChevronRightIcon 
} from "lucide-react";

const FileExplorer = ({ fileData, onFileSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedFile, setSelectedFile] = useState(null);

  // Toggle folder expansion
  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  // Render file tree
  const renderFileTree = (nodes, level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} style={{ paddingLeft: `${level * 16}px` }}>
        <button
          className={`w-full flex items-center gap-2 px-2 py-1 hover:bg-gray-700 rounded-sm ${
            selectedFile?.id === node.id ? "bg-gray-800" : ""
          }`}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.id);
            } else {
              setSelectedFile(node);
              onFileSelect(node);
            }
          }}
        >
          {node.type === "folder" ? (
            <>
              {expandedFolders.has(node.id) ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
              <FolderIcon className="w-4 h-4" />
            </>
          ) : (
            <>
              <span className="w-4" />
              <FileIcon className="w-4 h-4" />
            </>
          )}
          <span className="text-sm text-white">{node.name}</span>
        </button>
        {node.type === "folder" && expandedFolders.has(node.id) && node.children && (
          <div>{renderFileTree(node.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full border-r border-gray-700">
      <div className="p-2 border-b border-gray-700">
        <h2 className="font-semibold text-gray-300">Explorer</h2>
      </div>
      <div className="h-[calc(100vh-40px)] overflow-y-auto p-2">
        {renderFileTree(fileData)}
      </div>
    </div>
  );
};

export default FileExplorer;
