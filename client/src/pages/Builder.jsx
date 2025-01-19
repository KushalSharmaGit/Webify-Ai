import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CodeExplorer from '../components/CodeExplorer';
import { useWebContainer } from '@/hook/useWebContainer';
import { generateWebsite } from '../utils/generateWebsite';
import { fileExplorerData } from '../utils/FileSystem';

export const Builder = () => {
    const webContainer = useWebContainer();
    const location = useLocation();
    const { prompt } = location.state || {}; // Handle case where location.state is undefined

    const [generatedWebsite, setGeneratedWebsite] = useState(null); // Store the generated website data
    const [loading, setLoading] = useState(false); // Loading state
    const [code, setCode] = useState(null); // Code for the explorer

    // Fetch and generate website data
    const fetchAndGenerateWebsite = async () => {
        setLoading(true);
        try {
            const result = await generateWebsite(prompt); // Call the backend API
            setGeneratedWebsite(result);
        } catch (error) {
            console.error("Failed to generate website:", error);
        } finally {
            setLoading(false);
        }
    };

    //Function to tranform into the web containers format
    function transformToWebContainerFormat(files) {
        const fileSystem = {};
      
        // Helper function to process each file entry
        function processFile(file) {
          if (file.type === 'file') {
            // Create file entry
            fileSystem[file.name] = {
              file: {
                contents: file.content
              }
            };
          } else if (file.type === 'folder' && file.children) {
            // Process folder contents
            file.children.forEach(child => {
              // For files inside src folder, prefix with src/
              const path = file.name === 'src' ? `src/${child.name}` : child.name;
              fileSystem[path] = {
                file: {
                  contents: child.content
                }
              };
            });
          }
        }
      
        // Process each file in the array
        files.forEach(processFile);
      
        return fileSystem;
      }

    // Process website data into file explorer format
    useEffect(() => {
        if (generatedWebsite) {
            const explorerData = fileExplorerData(generatedWebsite);
            setCode(explorerData);
            console.log('Explorer data',explorerData);
            const mountFiles =transformToWebContainerFormat(explorerData);
            console.log(mountFiles);
            // if(webContainer){
            //     console.log("hii")
            // }else{
            //     console.log("bye");
            // }

        }
    }, [generatedWebsite]);

    // Main effect to initiate data fetch on component mount
    useEffect(() => {
        fetchAndGenerateWebsite();
    }, []); // Empty dependency array ensures this runs once

    // Render Loading or Code Explorer
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {code ? (
                <CodeExplorer fileData={code} />
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
};
