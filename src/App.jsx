import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PropertiesPage from './pages/PropertiesPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import OneParkLanePage from './pages/OneParkLanePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import IPDCPage from './pages/IPDCPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';

import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AdminPage from './pages/AdminPage';

import JoinPage from './pages/JoinPage';
import OffThePlanCalculatorPage from './pages/OffThePlanCalculatorPage';
import NotFoundPage from './pages/NotFoundPage';
import TheLucReviewsPage from './pages/TheLucReviewsPage';
import LucPrivateSalesPage from './pages/LucPrivateSalesPage';
// Site-wide rules that used to leak from the Luc page stylesheets. Must stay
// at this point in the import order to keep the cascade unchanged (see file).
import './legacy-globals.css';
import Footer from './components/Footer';
import ShortLinkRedirect from './pages/ShortLinkRedirect';
import PageLoader from './components/PageLoader';
import './index.css';

// Lazy-loaded: Sanity Studio is a large bundle that only visitors of /studio should pay for
const StudioPage = lazy(() => import('./pages/StudioPage'));
// Lazy-loaded: keeps Recharts out of the main bundle for everyone else
const NewVsEstablishedPage = lazy(() => import('./pages/NewVsEstablishedPage'));

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isStudioPage = location.pathname.startsWith('/studio');

  return (
    <div className="app-wrapper">
      <PageLoader />
      {!isAdminPage && !isStudioPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<PropertiesPage />} />
          {/* Specific route for One Park Lane BEFORE generic project ID route */}
          <Route path="/project/one-park-lane" element={<OneParkLanePage />} />
          <Route path="/project/luc/reviews" element={<TheLucReviewsPage />} />
          <Route path="/project/luc/private-sales" element={<LucPrivateSalesPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/ipdc" element={<IPDCPage />} />
          <Route path="/news" element={<BlogPage />} />
          <Route path="/news/:slug" element={<BlogPostPage />} />

          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

          <Route path="/admin" element={<AdminPage />} />
          <Route path="/join" element={<JoinPage />} />

          {/* Hidden calculator — accessible by direct link only, not in nav */}
          <Route path="/tools/off-the-plan-calculator" element={<OffThePlanCalculatorPage />} />

          {/* Showcase research page — noindex and out of the sitemap until compliance sign-off */}
          <Route path="/insights/new-vs-established-gold-coast" element={<Suspense fallback={null}><NewVsEstablishedPage /></Suspense>} />

          {/* Sanity Studio, embedded at /studio — must come before the short-link catch-all */}
          <Route
            path="/studio/*"
            element={(
              <Suspense fallback={null}>
                <StudioPage />
              </Suspense>
            )}
          />

          {/* Catch-all for short links - MUST be last before 404 */}
          <Route path="/:slug" element={<ShortLinkRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdminPage && !isStudioPage && <Footer />}
    </div>
  );
}

export default App;
