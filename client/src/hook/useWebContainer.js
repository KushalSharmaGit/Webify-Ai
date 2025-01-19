import { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';

export const useWebContainer = () => {
  const [webContainer, setWebContainer] = useState(null);

  useEffect(() => {
    const initWebContainer = async () => {
      try {
        const container = await WebContainer.boot();
        setWebContainer(container);
      } catch (error) {
        console.error("Failed to initialize WebContainer:", error);
      }
    };

    if (!webContainer) {
      initWebContainer();
    }
  }, [webContainer]);
  console.log(webContainer);
  return webContainer;
};
 