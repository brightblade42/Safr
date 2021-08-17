import React from 'react';

//I cannot tell a lie: I got this from my friendly neighborhood internet
export default function useTimeout(callback, delay) {

    const timeoutRef    = React.useRef(null);
    const savedCallback = React.useRef(callback);

    React.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    React.useEffect(() => {
        const tick = () => savedCallback.current();
        if (typeof delay === 'number') {
            timeoutRef.current = window.setTimeout(tick, delay);
            return () => window.clearTimeout(timeoutRef.current);
        }
    }, [delay]);

    return timeoutRef;
};