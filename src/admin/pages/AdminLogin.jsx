import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin();
        } catch (err) {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login">
            <div className="login-card">
                <div className="login-header">
                    <h1>🔐 لوحة التحكم</h1>
                    <p>مؤسسة المجد للإغاثة الإنسانية</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="login-error">{error}</div>}

                    <div className="login-field">
                        <label>البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label>كلمة المرور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
