import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Conversations } from './pages/Conversations';
import { Campaigns } from './pages/Campaigns';
import { KnowledgeBaseUpload } from './pages/KnowledgeBaseUpload';
import { KnowledgeBaseSearch } from './pages/KnowledgeBaseSearch';
import { Channels } from './pages/Channels';
import { Agents } from './pages/Agents';
import { Integrations } from './pages/Integrations';
import { Calendar } from './pages/Calendar';
import { Notifications } from './pages/Notifications';
import { Reports } from './pages/Reports';
import { Billing } from './pages/Billing';
import { Users } from './pages/Users';
import { Profile } from './pages/Profile';
import { Toaster } from 'react-hot-toast';
import { OrganizationProvider } from './contexts/OrganizationContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OrganizationProvider>
          <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="leads" element={<Leads />} />
                <Route path="conversations" element={<Conversations />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="kb-upload" element={<KnowledgeBaseUpload />} />
                <Route path="kb-search" element={<KnowledgeBaseSearch />} />
                <Route path="channels" element={<Channels />} />
                <Route path="agents" element={<Agents />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="reports" element={<Reports />} />
                <Route path="billing" element={<Billing />} />
                <Route path="users" element={<Users />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </OrganizationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
