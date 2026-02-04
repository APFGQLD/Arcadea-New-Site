import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const flags = {
    en: "https://flagcdn.com/w40/au.png",
    zh: "https://flagcdn.com/w40/cn.png",
    id: "https://flagcdn.com/w40/id.png"
};

const languages = [
    { code: 'en', name: 'English (AU)', flag: flags.en },
    { code: 'zh', name: '中文', flag: flags.zh },
    { code: 'id', name: 'Bahasa Indonesia', flag: flags.id },
];

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLang = languages.find(l => l.code === (i18n.language?.split('-')[0] || 'en')) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="language-selector" ref={dropdownRef}>
            <div className="lang-selected" onClick={() => setIsOpen(!isOpen)}>
                <img src={currentLang.flag} alt="" className="flag" />
                <span>{currentLang.code.toUpperCase()}</span>
            </div>

            {isOpen && (
                <div className="lang-dropdown">
                    {languages.map((lang) => (
                        <div
                            key={lang.code}
                            className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                            onClick={() => handleSelect(lang.code)}
                        >
                            <img src={lang.flag} alt="" className="flag" />
                            <span>{lang.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
