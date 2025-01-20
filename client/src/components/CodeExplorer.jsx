import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import FileExplorer from "./FileExplorer";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

const CodeExplorer = ({ fileData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewMode, setViewMode] = useState("code"); // 'code' or 'preview'

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 text-white">
      <ResizablePanelGroup direction="horizontal">
        {/* File Explorer Panel */}
        <ResizablePanel defaultSize={20} minSize={15}>
          <FileExplorer
            fileData={fileData}
            onFileSelect={(file) => setSelectedFile(file)}
          />
        </ResizablePanel>
        <ResizableHandle />
        {/* Editor/Preview Panel */}
        <ResizablePanel defaultSize={80}>
          <div className="h-full bg-gray-900">
            {/* View Mode Toggle */}
            <div className="flex justify-between items-center p-2 border-b border-gray-700">
              <h2 className="font-semibold text-gray-300">File Viewer</h2>
              <div>
                <button
                  onClick={() => setViewMode("code")}
                  className={`px-4 py-2 text-sm ${viewMode === "code" ? "bg-blue-600" : "bg-gray-600"} rounded-md`}
                >
                  Code
                </button>
                <button
                  onClick={() => setViewMode("preview")}
                  className={`ml-2 px-4 py-2 text-sm ${viewMode === "preview" ? "bg-blue-600" : "bg-gray-600"} rounded-md`}
                >
                  Preview
                </button>
              </div>
            </div>
            {/* Display Code or Preview */}
            {selectedFile ? (
              viewMode === "code" ? (
                <Editor
                  height="calc(100vh - 40px)"
                  defaultLanguage={
                    selectedFile.name.endsWith(".tsx") ? "typescript" : "javascript"
                  }
                  theme="vs-dark"
                  value={selectedFile.content || ""}
                  options={{
                    padding: '10px',
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    readOnly: true,
                    wordWrap: "on",
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  {/* You can add a preview of the file contents here */}
                  <iframe
                    srcDoc={selectedFile.content}
                    title="Preview"
                    className="w-full h-full border-none"
                  ></iframe>
                </div>
              )
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
