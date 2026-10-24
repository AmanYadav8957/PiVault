import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import UsersPage from './pages/UsersPage';
import CredentialsPage from './pages/CredentialsPage';
import EnvironmentsPage from './pages/EnvironmentsPage';
import DocumentsPage from './pages/DocumentsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import RoleProtectedRoute from './routes/RoleProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Corporate App Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/credentials" element={<CredentialsPage />} />
            <Route path="/environments" element={<EnvironmentsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
