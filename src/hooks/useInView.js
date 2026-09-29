import { useEffect, useState } from 'react';

/** True once the element has scrolled into view (never flips back). */
function useInView(ref, threshold = 0.25) {
    // Without IntersectionObserver support, just show everything immediately
    const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');
    useEffect(() => {
        const el = ref.current;
        if (!el || inView) return undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, threshold, inView]);
    return inView;
}

export default useInView;
