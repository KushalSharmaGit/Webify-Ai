import React from 'react';
import { FolderIcon, DocumentIcon } from '@heroicons/react/24/outline';

export default function Sidebar({ files, activeFile, onFileSelect }) {
  return (
    <aside className="w-64 bg-gray-800 text-white overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Project Files</h2>
        <div className="space-y-2">
          {Object.keys(files).map(path => (
            <button
              key={path}
              onClick={() => onFileSelect(path)}
              className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 ${
                activeFile === path ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <DocumentIcon className="h-4 w-4" />
              <span className="truncate">{path}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}