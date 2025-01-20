import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CodeExplorer from '../components/CodeExplorer';
import { useWebContainer } from '@/hook/useWebContainer';
import { generateWebsite } from '../utils/generateWebsite';
import { fileExplorerData } from '../utils/FileSystem';

export const Builder = () => {
    const { webContainer, loading, error } = useWebContainer(); // Get the web container and loading/error states
    const location = useLocation();
    const navigate = useNavigate();
    const { prompt } = location.state || {}; // Handle case where location.state is undefined
    const [url, setUrl] = useState(null);

    const [generatedWebsite, setGeneratedWebsite] = useState(null); // Store the generated website data
    const [code, setCode] = useState(null); // Code for the explorer

    // Fetch and generate website data
    const fetchAndGenerateWebsite = async () => {
        try {
            const result = await generateWebsite(prompt); // Call the backend API
            setGeneratedWebsite(result);
        } catch (error) {
            console.error("Failed to generate website:", error);
        }
    };

    // Running the WebContainer dev server
    async function startDevServer() {
        if (!webContainer) {
            console.log("WebContainer is not initialized");
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

            await webContainer.spawn('npm', ['run', 'dev']);

            console.log("The server has been run");

            // Wait for `server-ready` event
            webContainer.on('server-ready', (port, url) => {
                // ...
                console.log(url);
                console.log(port);
                setUrl(url);
            });
        } catch (error) {
            console.error('Error during dev server startup:', error);
        }
    }

    // Function to transform into the WebContainer format
    function transformToWebContainerFormat(files) {
        const fileSystem = {};

        function processFile(file) {
            if (file.type === 'file') {
                const fileName = file.name.startsWith('src/') ? file.name.replace('src/', '') : file.name;
                console.log(`Processing file: ${fileName}`);
                fileSystem[fileName] = {
                    file: {
                        contents: file.content,
                    },
                };
            } else if (file.type === 'folder' && file.children) {
                file.children.forEach((child) => {
                    const path = child.name.startsWith('src/') ? child.name.replace('src/', '') : child.name;
                    console.log(`Processing folder child: ${path}`);
                    fileSystem[path] = {
                        file: {
                            contents: child.content,
                        },
                    };
                });
            }
        }

        files.forEach(processFile);
        return fileSystem;
    }

    // Process website data into file explorer format
    useEffect(() => {
        if (generatedWebsite) {
            const explorerData = fileExplorerData(generatedWebsite);
            setCode(explorerData);
            console.log('Explorer data', explorerData);

            const mountFiles = transformToWebContainerFormat(explorerData);
            console.log('Mount files:', mountFiles);

            if (webContainer) {
                console.log('WebContainer is initialized, mounting files...');
                webContainer
                    .mount(mountFiles)
                    .then(() => {
                        console.log('Files mounted successfully!');
                        startDevServer();
                         // Start the dev server once files are mounted
                    })
                    .catch((err) => {
                        console.error('Error mounting files:', err);
                    });
            } else {
                console.log('Web container is not initialized');
            }
        }
    }, [generatedWebsite, webContainer]);

    // Main effect to initiate data fetch on component mount
    useEffect(() => {
        fetchAndGenerateWebsite();
    }, []);

    useEffect(()=>{
        console.log("Url is set", url);
    },[url])

    // Show loading or error status
    if (loading) {
        return <div>Loading WebContainer...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Render Loading or Code Explorer
    if (!generatedWebsite) {
        return <div>Loading website data...</div>;
    }

    return (
        <div>
            {code ? (
                <div>
                <CodeExplorer fileData={code} />
                {
                    url ?(<iframe src={url} height={"100px"} width={"100px"}></iframe>) :(<div>Preview is not available</div>)
                }
                </div>
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
};
