import { useEffect } from 'react';

export function UseScript(document, script_name) {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/static_js/' + script_name;
        script.async = true;
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        };
    }, [document, script_name])
}