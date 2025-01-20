import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CodeExplorer from '../components/CodeExplorer';
import { useWebContainer } from '@/hook/useWebContainer';
import { generateWebsite } from '../utils/generateWebsite';
import { fileExplorerData } from '../utils/FileSystem';
import {ClipLoader} from 'react-spinners';

export const Builder = () => {
    const { webContainer, loading, error } = useWebContainer();
    const location = useLocation();
    const navigate = useNavigate();
    const { prompt } = location.state || {};
    const [url, setUrl] = useState(null);
    const [urlLoading, setUrlLoading] = useState(true);
    const [generatedWebsite, setGeneratedWebsite] = useState(null);
    const [code, setCode] = useState(null);
    const [processError, setProcessError] = useState(null);

    // Fetch and generate website data
    const fetchAndGenerateWebsite = async () => {
        if (!prompt) {
            console.error("No prompt provided");
            setProcessError("No prompt provided");
            navigate('/');
            return;
        }

        try {
            const result = await generateWebsite(prompt);
            console.log("Generated website data:", result); // Log the result
            
            if (!result || typeof result !== 'object') {
                throw new Error('Invalid website data received');
            }
            
            setGeneratedWebsite(result);
            setProcessError(null);
        } catch (error) {
            console.error("Failed to generate website:", error);
            setProcessError("Failed to generate website: " + error.message);
        }
    };

    // Running the WebContainer dev server
    async function startDevServer() {
        if (!webContainer) {
            console.error("WebContainer is not initialized");
            setProcessError("WebContainer is not initialized");
            return;
        }

        try {
            console.log("Something is happening");
            const installProcess = await webContainer.spawn('npm', ['install']);

            installProcess.output.pipeTo(new WritableStream({
              write(data) {
                console.log(data);
              }
            }));
            
            const installExitCode = await installProcess.exit;

            if (installExitCode !== 0) {
                throw new Error('Unable to run npm install');
            } else{
                console.log("Node Modules Installed");
            }
            
            console.log("Node Modules Installed");

            await webContainer.spawn('npm', ['run', 'dev']);
            console.log("Dev server started");

            webContainer.on('server-ready', (port, url) => {
                console.log('Server ready on port:', port);
                console.log('Server URL:', url);
                setUrl(url);
                setUrlLoading(false);
            });
        } catch (error) {
            console.error('Error during dev server startup:', error);
            setProcessError("Error during dev server startup: " + error.message);
        }
    }

    // Function to transform into the WebContainer format
    function transformToWebContainerFormat(data) {
        const result = {};
      
        data.forEach((item) => {
          if (item.type === "folder") {
            // If the item is a folder, recursively process its children
            result[item.name] = {
              directory: transformToWebContainerFormat(item.children || []),
            };
          } else if (item.type === "file") {
            // If the item is a file, add it with its content
            result[item.name] = {
              file: {
                contents: item.content || "",
              },
            };
          }
        });
      
        return result;
      }

    // Effect to process website data and mount files
    useEffect(() => {
        if (generatedWebsite && webContainer) {
            try {
                console.log('Processing website data:', generatedWebsite);
                const explorerData = fileExplorerData(generatedWebsite);
                
                if (!explorerData) {
                    throw new Error('File explorer data is empty');
                }
                
                console.log('Explorer data:', explorerData);
                setCode(explorerData);

                const mountFiles = transformToWebContainerFormat(explorerData);
                console.log('Mount files:', mountFiles);

                webContainer.mount(mountFiles)
                    .then(() => {
                        console.log('Files mounted successfully!');
                        return startDevServer();
                    })
                    .catch((err) => {
                        console.error('Error mounting files:', err);
                        setProcessError("Error mounting files: " + err.message);
                    });
            } catch (error) {
                console.error('Error processing website data:', error);
                setProcessError("Error processing website data: " + error.message);
            }
        }
    }, [generatedWebsite, webContainer]);

    // Initial effect to fetch website data
    useEffect(() => {
        fetchAndGenerateWebsite();
    }, [prompt]);
    if (!generatedWebsite) {
        return (
            <div className='h-screen w-screen flex flex-col items-center justify-center align-middle bg-zinc-900'>
            <ClipLoader size={70} color="#ffffff"/>
            <p className='text-white text-4xl'>Creating your Webiste</p>
            </div>
        );
    }

    return (
        <div className="container">
            {code ? (
                <div>
                    <CodeExplorer fileData={code} webContainer={webContainer} url={url} isLoading={urlLoading}/>
                </div>
            ) : (
                <div className="p-4 text-gray-500 text-center">No data available</div>
            )}
        </div>
    );
};