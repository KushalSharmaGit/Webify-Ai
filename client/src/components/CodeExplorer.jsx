import React, { useState } from 'react';
import Editor from "@monaco-editor/react";
import { 
  FolderIcon, 
  FileIcon, 
  ChevronDownIcon, 
  ChevronRightIcon 
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

const CodeExplorer = ({ fileData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());

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
            selectedFile?.id === node.id ? 'bg-gray-800' : ''
          }`}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              setSelectedFile(node);
            }
          }}
        >
          {node.type === 'folder' ? (
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
        {node.type === 'folder' && expandedFolders.has(node.id) && node.children && (
          <div>{renderFileTree(node.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 text-white">
      <ResizablePanelGroup direction="horizontal">
        {/* Explorer Panel */}
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="h-full border-r border-gray-700">
            <div className="p-2 border-b border-gray-700">
              <h2 className="font-semibold text-gray-300">Explorer</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-40px)]">
              <div className="p-2">{renderFileTree(fileData)}</div>
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        {/* Editor Panel */}
        <ResizablePanel defaultSize={80}>
          <div className="h-full bg-gray-900">
            {selectedFile ? (
              <Editor
                height="100vh"
                defaultLanguage={selectedFile.name.endsWith('.tsx') ? 'typescript' : 'javascript'}
                theme="vs-dark"
                value={selectedFile.content || ''}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  readOnly: true,
                  wordWrap: 'on'
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a file to view its contents
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeExplorer;
