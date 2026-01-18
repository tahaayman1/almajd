import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, isAuthenticated, loading }) {
    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                <div className="spinner" style={{ width: '30px', height: '30px', borderWidth: '3px', borderColor: '#cbd5e1', borderTopColor: '#3b82f6' }}></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
}

export default ProtectedRoute;
