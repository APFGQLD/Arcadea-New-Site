import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Properties from '../components/Properties';
import Services from '../components/Services';
import About from '../components/About';
import Contact from '../components/Contact';
import usePageTitle from '../hooks/usePageTitle';

const Home = () => {
    const { hash } = useLocation();

    usePageTitle(); // default site title

    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [hash]);

    // Add structured data for SEO
    useEffect(() => {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Arcadea Property",
            "description": "Premium off-plan investment properties in Bali and Australia. Curated coastal and island collections.",
            "url": "https://arcadea.com.au",
            "logo": "https://arcadea.com.au/logo.png",
            "sameAs": [
                "https://www.facebook.com/arcadeaproperty",
                "https://www.instagram.com/arcadeaproperty"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Sales",
                "email": "info@arcadea.com.au"
            },
            "areaServed": [
                {
                    "@type": "Place",
                    "name": "Bali, Indonesia"
                },
                {
                    "@type": "Place",
                    "name": "Australia"
                }
            ]
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(structuredData);
        script.id = 'structured-data-home';
        document.head.appendChild(script);

        return () => {
            const existingScript = document.getElementById('structured-data-home');
            if (existingScript) {
                document.head.removeChild(existingScript);
            }
        };
    }, []);

    return (
        <>
            <Hero />
            <Properties />
            <Services />
            <About />
            <Contact />
        </>
    );
};

export default Home;
