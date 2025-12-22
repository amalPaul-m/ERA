import React from 'react';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import { FamilyProvider } from './context/FamilyContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import FamilyDetails from './pages/FamilyDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import FamilyForm from './pages/FamilyForm';
import FamilyLogin from './pages/FamilyLogin';
import FeeManagement from './pages/FeeManagement';

function App() {
  return (
    <AuthProvider>
      <FamilyProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<FamilyLogin />} />
              <Route path="family/:id" element={<FamilyDetails />} />
              <Route path="admin" element={<AdminLogin />} />
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/fees" element={<FeeManagement />} />
              <Route path="admin/family/new" element={<FamilyForm />} />
              <Route path="admin/family/edit/:id" element={<FamilyForm />} />
            </Route>
          </Routes>
        </HashRouter>
      </FamilyProvider>
    </AuthProvider>
  );
}

export default App;
