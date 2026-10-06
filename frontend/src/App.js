import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, CircularProgress } from '@mui/material';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';

// Clean, essential pages
const VerifyPage = lazy(() => import('./pages/VerifyPage'));
const NLPGuidePage = lazy(() => import('./pages/NLPGuidePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// Loading fallback component
const PageLoader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
    flexDirection="column"
    gap={2}
  >
    <CircularProgress size={44} sx={{ color: 'var(--neon-blue)' }} />
    <Box sx={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
      Loading MitraVerify Engine...
    </Box>
  </Box>
);

function App() {
  return (
    <ErrorBoundary>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
        }}
      >
        {/* SEO Meta Tags */}
        <Helmet>
          <title>MitraVerify | मित्रवेरिफाई - Hindi Spam & Misinformation Verification</title>
          <meta
            name="description"
            content="Accurate Hindi spam, scam and misinformation detection powered by NLP Tokenization, TF-IDF, and Naive Bayes."
          />
          <meta name="theme-color" content="#0a0c10" />
        </Helmet>

        {/* Global Professional Navigation Bar */}
        <Navbar />

        {/* Main Application Content */}
        <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Main Core Verification Hub */}
              <Route path="/" element={<VerifyPage />} />
              <Route path="/verify" element={<Navigate to="/" replace />} />

              {/* In-Depth NLP Fundamentals & Architecture Guide */}
              <Route path="/nlp-basics" element={<NLPGuidePage />} />

              {/* About MitraVerify */}
              <Route path="/about" element={<AboutPage />} />

              {/* Fallback all deprecated or non-existent routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Box>

        {/* Global Professional Footer */}
        <Footer />
      </Box>
    </ErrorBoundary>
  );
}

export default App;
