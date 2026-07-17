import { useEffect, useState } from 'react';

const useParallax = (speed = 0.5) => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        let animationFrameId;

        const handleScroll = () => {
            animationFrameId = requestAnimationFrame(() => {
                setOffset(window.scrollY * speed);
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [speed]);

    return offset;
};

export default useParallax;
