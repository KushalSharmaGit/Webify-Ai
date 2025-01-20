import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import FileExplorer from "./FileExplorer";
import {ClipLoader} from 'react-spinners';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

const CodeExplorer = ({ fileData, webContainer, url, isLoading }) => {
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
            <div className="flex justify-center items-center p-2 border-b border-gray-700">
              <button
                onClick={() => setViewMode("code")}
                className={`px-4 py-2 mr-4 text-sm ${
                  viewMode === "code" ? "bg-blue-600" : "bg-gray-600"
                } rounded-md`}
              >
                Code
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`ml-2 px-4 py-2 text-sm ${
                  viewMode === "preview" ? "bg-blue-600" : "bg-gray-600"
                } rounded-md`}
              >
                Preview
              </button>
            </div>
            {/* Display Code or Preview */}
            {viewMode === "code" ? (
              <Editor
                height="calc(100vh - 40px)"
                defaultLanguage={
                  selectedFile?.name?.endsWith(".tsx") ? "typescript" : "javascript"
                }
                theme="vs-dark"
                value={selectedFile?.content || ""}
                options={{
                  padding: "10px",
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  readOnly: true,
                  wordWrap: "on",
                }}
              />
            ) : (
              <div className="h-full">
                {isLoading ? (
                    <div className='h-full w-full flex items-center justify-center'>
                    <ClipLoader size={70} color="#ffffff"/>
                    </div>
                ) : url ? (
                  <iframe
                    src={url}
                    className="w-full h-full"
                    allow="cross-origin-isolated"
                    title="Website Preview"
                  />
                ) : (
                  <div className="p-4 text-gray-500 text-center">
                    Preview is not available
                  </div>
                )}
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeExplorer;
