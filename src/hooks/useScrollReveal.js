import { useEffect } from 'react';

const useScrollReveal = (selector = '.reveal', threshold = 0.15) => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        // We do not unobserve if we want it to animate every time it enters the viewport
                        // For a premium feel, unobserving is sometimes better so it only happens once.
                        // We will unobserve to keep it clean.
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: threshold,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, [selector, threshold]);
};

export default useScrollReveal;
