import React, { useEffect, useRef } from 'react';

export default function ProjectPreview({ files }) {
  const iframeRef = useRef();

  useEffect(() => {
    if (files['index.html']) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument;
      
      iframeDoc.open();
      iframeDoc.write(files['index.html']);
      iframeDoc.close();
    }
  }, [files]);

  return (
    <div className="h-full bg-white">
      <div className="p-2 bg-gray-100 border-b">
        <h3 className="font-medium">Preview</h3>
      </div>
      <iframe
        ref={iframeRef}
        className="w-full h-[calc(100%-2.5rem)]"
        title="Preview"
      />
    </div>
  );
}