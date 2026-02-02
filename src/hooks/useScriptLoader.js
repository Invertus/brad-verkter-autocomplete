import { useEffect, useRef } from 'react';

export default function useScriptLoader(scriptUrl, onLoad) {
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        if (!scriptUrl) return;

        if (scriptLoadedRef.current) {
            onLoad();
            return;
        }

        const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
        if (existingScript) {
            scriptLoadedRef.current = true;
            onLoad();
            return;
        }

        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        script.onload = () => {
            scriptLoadedRef.current = true;
            onLoad();
        };
        script.onerror = () => console.error('Failed to load BradSearch script');
        document.head.appendChild(script);
    }, [scriptUrl, onLoad]);
}
