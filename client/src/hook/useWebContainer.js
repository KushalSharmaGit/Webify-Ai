import { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';

export const useWebContainer = () => {
  const [webContainer, setWebContainer] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for container initialization
  const [error, setError] = useState(null); // Error state for debugging

  useEffect(() => {
    const initWebContainer = async () => {
      try {
        console.log("Initializing WebContainer...");
        const container = await WebContainer.boot();
        console.log("WebContainer initialized:", container);
        setWebContainer(container);
        setLoading(false); // Set loading to false when initialization is complete
      } catch (error) {
        console.error("Failed to initialize WebContainer:", error);
        setError("Failed to initialize WebContainer");
        setLoading(false);
      }
    };

    // Initialize WebContainer only once when component mounts
    if (!webContainer) {
      initWebContainer();
    }
  }, [webContainer]); // Only runs once, when the component mounts

  return { webContainer, loading, error }; // Return loading and error state for debugging
};
