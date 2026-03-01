import React from 'react';
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
import FlyBeforeYouBuyPage from './pages/FlyBeforeYouBuyPage';
import EventReplayPage from './pages/EventReplayPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AdminPage from './pages/AdminPage';
import PertamaInvestPage from './pages/PertamaInvestPage';
import JoinPage from './pages/JoinPage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/Footer';
import ShortLinkRedirect from './pages/ShortLinkRedirect';
import PageLoader from './components/PageLoader';
import './index.css';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="app-wrapper">
      <PageLoader />
      {!isAdminPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<PropertiesPage />} />
          {/* Specific route for One Park Lane BEFORE generic project ID route */}
          <Route path="/project/one-park-lane" element={<OneParkLanePage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/ipdc" element={<IPDCPage />} />
          <Route path="/news" element={<BlogPage />} />
          <Route path="/news/:slug" element={<BlogPostPage />} />
          <Route path="/campaigns/fly-before-you-buy" element={<FlyBeforeYouBuyPage />} />
          <Route path="/campaign/pertama" element={<PertamaInvestPage />} />
          <Route path="/event/replay" element={<EventReplayPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/join" element={<JoinPage />} />

          {/* Catch-all for short links - MUST be last before 404 */}
          <Route path="/:slug" element={<ShortLinkRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;
