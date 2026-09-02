import { Studio } from 'sanity';
import { studioConfig } from '../sanity/studioConfig';

// Sanity's layout relies on its container having an explicit height to fill.
// The rest of this site's layout is unstyled/auto-height, so give Studio its
// own fixed full-viewport box rather than changing global page CSS.
const studioViewportStyle = {
    position: 'fixed',
    inset: 0,
    height: '100vh',
};

const StudioPage = () => {
    return (
        <div style={studioViewportStyle}>
            <Studio config={studioConfig} unstable_globalStyles />
        </div>
    );
};

export default StudioPage;
