import React, { createContext, useContext, useState } from 'react';

// Lets a page (e.g. the project detail page's sticky section menu) hide the
// global Navbar once its own sticky bar takes over the top of the viewport.
const NavVisibilityContext = createContext();

export const useNavVisibility = () => useContext(NavVisibilityContext);

export const NavVisibilityProvider = ({ children }) => {
    const [navHidden, setNavHidden] = useState(false);

    return (
        <NavVisibilityContext.Provider value={{ navHidden, setNavHidden }}>
            {children}
        </NavVisibilityContext.Provider>
    );
};
