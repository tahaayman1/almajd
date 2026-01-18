import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

function AdminLayout({ onLogout }) {
    return (
        <div className="admin-layout">
            <Sidebar onLogout={onLogout} />
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
