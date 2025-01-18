import { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import ProjectPreview from './components/ProjectPreview';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFile, setActiveFile] = useState(null);

  const handleBuild = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/generate-website', {
        prompt,
      });
      console.log(response.data);
      setFiles(response.data.code.files.reduce((acc, file) => {
        acc[file.path] = file.content;
        return acc;
      }, {}));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModify = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:3000/api/modify', {
        prompt,
        files,
        currentState: {
          dependencies: {}
        }
      });

      const updatedFiles = { ...files };
      response.data.code.files.forEach(file => {
        updatedFiles[file.path] = file.content;
      });
      
      setFiles(updatedFiles);
    } catch (err)
    {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          files={files}
          activeFile={activeFile}
          onFileSelect={setActiveFile}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 bg-white border-b">
            <textarea
              className="w-full p-2 border rounded"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to build..."
              rows={3}
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleBuild}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {loading ? 'Building...' : 'Build Website'}
              </button>
              <button
                onClick={handleModify}
                disabled={loading || Object.keys(files).length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Modify
              </button>
            </div>
            {error && (
              <div className="mt-2 text-red-600">
                Error: {error}
              </div>
            )}
          </div>

          <div className="flex-1 flex">
            {activeFile && (
              <div className="w-1/2 border-r">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={files[activeFile]}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false }
                  }}
                />
              </div>
            )}
            <div className={activeFile ? 'w-1/2' : 'w-full'}>
              <ProjectPreview files={files} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}