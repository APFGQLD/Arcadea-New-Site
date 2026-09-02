const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time (in whole minutes, minimum 1) from a Portable Text
 * content array. Returns null when there's no text to measure.
 */
export const getReadingTime = (content) => {
    if (!Array.isArray(content)) return null;

    const wordCount = content.reduce((count, block) => {
        if (block?._type !== 'block' || !Array.isArray(block.children)) return count;
        const text = block.children.map((child) => child.text || '').join(' ');
        return count + text.split(/\s+/).filter(Boolean).length;
    }, 0);

    if (wordCount === 0) return null;
    return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
};
