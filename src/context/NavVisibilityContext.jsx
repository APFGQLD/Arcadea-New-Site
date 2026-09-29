import React, { createContext, useContext, useState } from 'react';

// Lets a page (e.g. the project detail page's sticky section menu) hide the
// global Navbar once its own sticky bar takes over the top of the viewport.
//
// Also lets a page whose hero stays dark in both themes (a photo hero with a
// dark overlay) ask for the white logo and nav text while the Navbar is
// transparent over it — normally that only happens in the dark theme, since
// light-theme heroes are light-washed.
const NavVisibilityContext = createContext();

export const useNavVisibility = () => useContext(NavVisibilityContext);

export const NavVisibilityProvider = ({ children }) => {
    const [navHidden, setNavHidden] = useState(false);
    const [navOverDarkHero, setNavOverDarkHero] = useState(false);

    return (
        <NavVisibilityContext.Provider value={{ navHidden, setNavHidden, navOverDarkHero, setNavOverDarkHero }}>
            {children}
        </NavVisibilityContext.Provider>
    );
};
