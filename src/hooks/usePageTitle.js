import { useEffect } from 'react';

const BASE_TITLE = 'Arcadea Property';
const DEFAULT_TITLE = `${BASE_TITLE} | Exquisite Living, Refined Investments`;

/**
 * Sets the document title for the current page.
 * Pass a page name (e.g. "About Us") to get "About Us | Arcadea Property".
 * Pass nothing (or undefined while data is loading) to keep the default site title.
 */
const usePageTitle = (title) => {
    useEffect(() => {
        document.title = title ? `${title} | ${BASE_TITLE}` : DEFAULT_TITLE;
    }, [title]);
};

export default usePageTitle;
