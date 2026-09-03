// Wraps a callback so it runs at most once per animation frame, using the
// arguments from the most recent call. Scroll/mousemove events can fire far
// more often than the display repaints (especially on high-poll-rate mice
// and precision trackpads), so running work on every raw event does more
// than the browser can paint and the page falls behind, then jumps to catch
// up. Throttling to the frame rate keeps it smooth.
export const rafThrottle = (fn) => {
    let rafId = null;
    let lastArgs = [];

    const throttled = (...args) => {
        lastArgs = args;
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
            rafId = null;
            fn(...lastArgs);
        });
    };

    throttled.cancel = () => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    return throttled;
};
