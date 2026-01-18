import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [destinationData, setDestinationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

    const destinationNames = {
        'gb': 'بريطانيا',
        'de': 'المانيا',
        'fr': 'فرنسا',
        'ca': 'كندا',
        'au': 'استراليا',
        'nl': 'هولندا',
        'be': 'بلجيكا',
        'ch': 'سويسرا',
        'es': 'اسبانيا',
        'it': 'ايطاليا',
        'za': 'جنوب افريقيا',
        'my': 'ماليزيا',
        'id': 'اندونيسيا'
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const applicationsRef = collection(db, 'applications');


            const allDocsSnapshot = await getDocs(applicationsRef);
            const allApplications = allDocsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));


            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - 7);
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);


            let todayCount = 0;
            let weekCount = 0;
            let monthCount = 0;
            const destCount = {};

            allApplications.forEach(app => {
                const createdAt = app.createdAt?.toDate ? app.createdAt.toDate() : new Date(app.createdAt);

                if (createdAt >= startOfToday) todayCount++;
                if (createdAt >= startOfWeek) weekCount++;
                if (createdAt >= startOfMonth) monthCount++;


                if (app.destinationCountry) {
                    destCount[app.destinationCountry] = (destCount[app.destinationCountry] || 0) + 1;
                }
            });

            setStats({
                total: allApplications.length,
                today: todayCount,
                thisWeek: weekCount,
                thisMonth: monthCount
            });


            const sortedApps = allApplications.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                return dateB - dateA;
            });
            setRecentApplications(sortedApps.slice(0, 5));


            const destData = Object.entries(destCount).map(([key, value]) => ({
                name: destinationNames[key] || key,
                value: value
            }));
            setDestinationData(destData);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dashboard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="dashboard-title">📊 لوحة المعلومات</h1>
                {loading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                        <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                        <span>جاري التحديث...</span>
                    </div>
                )}
                {error && (
                    <div style={{ color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>⚠️</span>
                        <span>خطأ: تأكد من إعداد Firebase</span>
                    </div>
                )}
            </div>


            <div className="stats-grid">
                <div className="stat-card stat-total">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">إجمالي الطلبات</span>
                    </div>
                </div>
                <div className="stat-card stat-today">
                    <div className="stat-icon">📅</div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.today}</span>
                        <span className="stat-label">طلبات اليوم</span>
                    </div>
                </div>
                <div className="stat-card stat-week">
                    <div className="stat-icon">📆</div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.thisWeek}</span>
                        <span className="stat-label">هذا الأسبوع</span>
                    </div>
                </div>
                <div className="stat-card stat-month">
                    <div className="stat-icon">🗓️</div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.thisMonth}</span>
                        <span className="stat-label">هذا الشهر</span>
                    </div>
                </div>
            </div>


            <div className="charts-grid">
                <div className="chart-card">
                    <h3>📍 الوجهات المفضلة</h3>
                    {destinationData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={destinationData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {destinationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="no-data">لا توجد بيانات بعد</p>
                    )}
                </div>

                <div className="chart-card">
                    <h3>📈 إحصائيات سريعة</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                            { name: 'اليوم', value: stats.today },
                            { name: 'الأسبوع', value: stats.thisWeek },
                            { name: 'الشهر', value: stats.thisMonth },
                            { name: 'الإجمالي', value: stats.total }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(0,0,0,0.8)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>


            <div className="recent-applications">
                <h3>🕐 آخر الطلبات</h3>
                {recentApplications.length > 0 ? (
                    <div className="applications-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>الاسم</th>
                                    <th>الهاتف</th>
                                    <th>الوجهة</th>
                                    <th>التاريخ</th>
                                    <th>الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentApplications.map(app => (
                                    <tr key={app.id}>
                                        <td>{app.fullName}</td>
                                        <td dir="ltr">{app.phone}</td>
                                        <td>{destinationNames[app.destinationCountry] || app.destinationCountry}</td>
                                        <td>{formatDate(app.createdAt)}</td>
                                        <td>
                                            <span className={`status-badge status-${app.status || 'pending'}`}>
                                                {app.status === 'approved' ? 'مقبول' :
                                                    app.status === 'rejected' ? 'مرفوض' :
                                                        app.status === 'reviewing' ? 'قيد المراجعة' : 'قيد الانتظار'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="no-data">لا توجد طلبات بعد</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
