import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './components/MainLayout';

// Direct Page Imports
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { OpportunityDetailsPage } from './pages/OpportunityDetailsPage';
import { AIMatchPage } from './pages/AIMatchPage';
import { AICareerPage } from './pages/AICareerPage';
import { SavedPage } from './pages/SavedPage';
import { CalendarPage } from './pages/CalendarPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public SaaS Marketing pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Secure interactive student dashboard shell */}
          <Route 
            path="/dashboard" 
            element={
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/discover" 
            element={
              <MainLayout>
                <DiscoverPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/discover/:id" 
            element={
              <MainLayout>
                <OpportunityDetailsPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/ai-match" 
            element={
              <MainLayout>
                <AIMatchPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/ai-assistant" 
            element={
              <MainLayout>
                <AICareerPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/saved" 
            element={
              <MainLayout>
                <SavedPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <MainLayout>
                <CalendarPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <MainLayout>
                <NotificationsPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            } 
          />

          {/* Fallback 404 Route */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
