import { useEffect } from 'react';

const useScrollReveal = (selectorOrRef = '.reveal', threshold = 0.15) => {
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

        let elements = [];
        if (typeof selectorOrRef === 'string') {
            elements = document.querySelectorAll(selectorOrRef);
        } else if (selectorOrRef && selectorOrRef.current) {
            elements = selectorOrRef.current.querySelectorAll('.reveal');
        }

        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, [selectorOrRef, threshold]);
};

export default useScrollReveal;
