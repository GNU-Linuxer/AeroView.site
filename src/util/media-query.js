/*
 * This file provides support for media queries pertinent to this app.
 */

import { useState, useEffect } from 'react';

/*
 * A hook for checking if mobile view should be used.  Returns true if the
 * current screen width is for mobile view, false otherwise.
 */
export const useMobileView = () => {
    const width = useWindowWidth();
    return width < 768;
};

/*
 * A hook for checking if large screen view should be used.  Returns true if
 * the current screen width is for large screen view, false otherwise.
 */
export const useLargeView = () => {
    const width = useWindowWidth();
    return width >= 1024;
}

/*
 * A custom hook for dynamically obtaining width of the window
 * Reference: https://blog.logrocket.com/developing-responsive-layouts-with-react-hooks/
 */
const useWindowWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        let updateWindowWidth = () => setWidth(window.innerWidth);
        window.addEventListener("resize", updateWindowWidth);
        return () => window.removeEventListener("resize", updateWindowWidth);
    });
    return width;
};
