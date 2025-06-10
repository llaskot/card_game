import { useEffect } from 'react';

export const useLoadScripts = (scripts) => {
//   const [loaded, setLoaded] = useState(false);
//   const [error, setError] = useState(null);
  console.log("here in load")

  useEffect(() => {
    const scripts_elements = []
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
        scripts_elements.push(script)
      });
    };

    const loadScriptsInSequence = async () => {
    //   try {
        for (const script of scripts) {
          await loadScript(script);
        }
    //     setLoaded(true);
    //   } catch (err) {
    //     setError(err);
    //   }
    };

    loadScriptsInSequence();
    return () => {
        scripts_elements.forEach((el) => document.body.removeChild(el))
    }
  }, [scripts]);

//   return { loaded, error };
};


// Example usage in a component
// function MyComponent() {
//   const { loaded, error } = useLoadScripts(['script1.js', 'script2.js']);

//   if (error) {
//     return <div>Error loading scripts: {error.message}</div>;
//   }

//   if (!loaded) {
//     return <div>Loading scripts...</div>;
//   }

//   return <div>Scripts loaded successfully!</div>;
// }