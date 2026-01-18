import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';


import Header from './components/Header';
import NoticeModal from './components/NoticeModal';
import Hero from './components/Hero';
import About from './components/About';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import UploadOverlay from './components/UploadOverlay';
import Toast from './components/Toast';


import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import ApplicationsList from './admin/pages/ApplicationsList';
import ProtectedRoute from './admin/ProtectedRoute';


import './style.css';
import './admin/admin.css';


function MainLayout() {
    const [showModal, setShowModal] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const handleShowToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
    };

    return (
        <>
            <Header />
            <NoticeModal isOpen={showModal} onClose={() => setShowModal(false)} />
            <Hero />
            <About />
            <ContactForm
                onShowToast={handleShowToast}
                onShowUpload={setShowUpload}
            />
            <Footer />
            {showUpload && <UploadOverlay />}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: '', type: 'success' })}
                />
            )}
        </>
    );
}


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />} />


                <Route path="/admin/login" element={
                    !loading && isAuthenticated ? <Navigate to="/admin" replace /> : <AdminLogin onLogin={() => setIsAuthenticated(true)} />
                } />

                <Route path="/admin" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                        <AdminLayout onLogout={() => setIsAuthenticated(false)} />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="applications" element={<ApplicationsList />} />
                </Route>
            </Routes>
        </Router>
    );
}

import { Navigate } from 'react-router-dom';

export default App;
