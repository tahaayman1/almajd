import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

function Sidebar({ onLogout }) {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            onLogout();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h2>🏢 المجد</h2>
                <p>لوحة التحكم</p>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/admin" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <span className="nav-icon">📊</span>
                    <span>لوحة المعلومات</span>
                </NavLink>

                <NavLink to="/admin/applications" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <span className="nav-icon">📋</span>
                    <span>الطلبات</span>
                </NavLink>

                <NavLink to="/" className="nav-item">
                    <span className="nav-icon">🌐</span>
                    <span>الموقع الرئيسي</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <span>🚪</span>
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
