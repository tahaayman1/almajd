import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

function ApplicationsList() {
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedApp, setSelectedApp] = useState(null);

    const destinationNames = {
        'gb': 'بريطانيا', 'de': 'المانيا', 'fr': 'فرنسا', 'ca': 'كندا',
        'au': 'استراليا', 'nl': 'هولندا', 'be': 'بلجيكا', 'ch': 'سويسرا',
        'es': 'اسبانيا', 'it': 'ايطاليا', 'za': 'جنوب افريقيا', 'my': 'ماليزيا', 'id': 'اندونيسيا'
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [applications, searchTerm, statusFilter]);

    const fetchApplications = async () => {
        try {
            const applicationsRef = collection(db, 'applications');
            const snapshot = await getDocs(applicationsRef);
            const apps = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));


            apps.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
                return dateB - dateA;
            });

            setApplications(apps);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = () => {
        let filtered = [...applications];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(app =>
                app.fullName?.toLowerCase().includes(term) ||
                app.phone?.includes(term) ||
                app.email?.toLowerCase().includes(term) ||
                app.idNumber?.includes(term)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => (app.status || 'pending') === statusFilter);
        }

        setFilteredApps(filtered);
    };

    const updateStatus = async (appId, newStatus) => {
        try {
            await updateDoc(doc(db, 'applications', appId), {
                status: newStatus,
                updatedAt: new Date()
            });

            setApplications(prev => prev.map(app =>
                app.id === appId ? { ...app, status: newStatus } : app
            ));

            if (selectedApp?.id === appId) {
                setSelectedApp(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteApplication = async (appId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;

        try {
            await deleteDoc(doc(db, 'applications', appId));
            setApplications(prev => prev.filter(app => app.id !== appId));
            setSelectedApp(null);
        } catch (error) {
            console.error('Error deleting application:', error);
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

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { label: 'قيد الانتظار', class: 'pending' },
            'reviewing': { label: 'قيد المراجعة', class: 'reviewing' },
            'approved': { label: 'مقبول', class: 'approved' },
            'rejected': { label: 'مرفوض', class: 'rejected' }
        };
        const s = statusMap[status] || statusMap['pending'];
        return <span className={`status-badge status-${s.class}`}>{s.label}</span>;
    };

    return (
        <div className="applications-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="dashboard-title">📋 إدارة الطلبات</h1>
                {loading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                        <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                        <span>جاري التحديث...</span>
                    </div>
                )}
                {error && (
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>
                        ⚠️ خطأ في الاتصال بقاعدة البيانات
                    </div>
                )}
            </div>

            <div className="filters-bar">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 بحث بالاسم، الهاتف، البريد..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="status-filter">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">كل الحالات</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="reviewing">قيد المراجعة</option>
                        <option value="approved">مقبول</option>
                        <option value="rejected">مرفوض</option>
                    </select>
                </div>
                <div className="results-count">
                    عدد النتائج: <strong>{filteredApps.length}</strong>
                </div>
            </div>

            <div className="applications-layout">
                <div className="applications-list">
                    {filteredApps.length === 0 ? (
                        <div className="no-results">
                            <p>لا توجد طلبات مطابقة للبحث</p>
                        </div>
                    ) : (
                        filteredApps.map(app => (
                            <div
                                key={app.id}
                                className={`application-card ${selectedApp?.id === app.id ? 'selected' : ''}`}
                                onClick={() => setSelectedApp(app)}
                            >
                                <div className="app-card-header">
                                    <h4>{app.fullName}</h4>
                                    {getStatusBadge(app.status)}
                                </div>
                                <div className="app-card-info">
                                    <span>📞 {app.phone}</span>
                                    <span>🌍 {destinationNames[app.destinationCountry] || app.destinationCountry}</span>
                                </div>
                                <div className="app-card-date">
                                    {formatDate(app.createdAt)}
                                </div>
                            </div>
                        ))
                    )}
                </div>


                {selectedApp && (
                    <div className="application-details">
                        <div className="details-header">
                            <h3>📄 تفاصيل الطلب</h3>
                            <button className="close-btn" onClick={() => setSelectedApp(null)}>✕</button>
                        </div>

                        <div className="details-content">
                            <div className="detail-group">
                                <h4>المعلومات الشخصية</h4>
                                <div className="detail-row">
                                    <span className="label">الاسم:</span>
                                    <span className="value">{selectedApp.fullName}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">الجنس:</span>
                                    <span className="value">{selectedApp.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">رقم الهوية:</span>
                                    <span className="value">{selectedApp.idNumber}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">تاريخ الميلاد:</span>
                                    <span className="value">{selectedApp.birthDate}</span>
                                </div>
                            </div>

                            <div className="detail-group">
                                <h4>معلومات التواصل</h4>
                                <div className="detail-row">
                                    <span className="label">الهاتف:</span>
                                    <span className="value" dir="ltr">{selectedApp.phone}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">البريد:</span>
                                    <span className="value">{selectedApp.email}</span>
                                </div>
                            </div>

                            <div className="detail-group">
                                <h4>معلومات السفر</h4>
                                <div className="detail-row">
                                    <span className="label">الوجهة:</span>
                                    <span className="value">{destinationNames[selectedApp.destinationCountry] || selectedApp.destinationCountry}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">جواز السفر:</span>
                                    <span className="value">{selectedApp.passportStatus}</span>
                                </div>
                            </div>

                            {selectedApp.mainFileBase64 && (
                                <div className="detail-group">
                                    <h4>📎 صورة المستند الرئيسي</h4>
                                    <div style={{ marginTop: '1rem' }}>
                                        <img
                                            src={selectedApp.mainFileBase64}
                                            alt="المستند الرئيسي"
                                            style={{
                                                width: '100%',
                                                maxWidth: '400px',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => window.open(selectedApp.mainFileBase64)}
                                        />
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                                            اضغط على الصورة للتكبير
                                        </p>
                                    </div>
                                </div>
                            )}

                            {selectedApp.familyMembers?.length > 0 && (
                                <div className="detail-group">
                                    <h4>أفراد العائلة ({selectedApp.familyMembers.length})</h4>
                                    {selectedApp.familyMembers.map((member, idx) => (
                                        <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                            <div className="family-member">
                                                <span>{member.fullName}</span>
                                                <span>({member.relation})</span>
                                            </div>
                                            {member.fileBase64 && (
                                                <div style={{ marginTop: '0.5rem' }}>
                                                    <img
                                                        src={member.fileBase64}
                                                        alt={`مستند ${member.fullName}`}
                                                        style={{
                                                            width: '100%',
                                                            maxWidth: '200px',
                                                            borderRadius: '8px',
                                                            border: '1px solid #e2e8f0',
                                                            cursor: 'pointer',
                                                            marginTop: '0.5rem'
                                                        }}
                                                        onClick={() => window.open(member.fileBase64)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="detail-group">
                                <h4>تحديث الحالة</h4>
                                <div className="status-actions">
                                    <button
                                        className="status-btn pending"
                                        onClick={() => updateStatus(selectedApp.id, 'pending')}
                                    >قيد الانتظار</button>
                                    <button
                                        className="status-btn reviewing"
                                        onClick={() => updateStatus(selectedApp.id, 'reviewing')}
                                    >قيد المراجعة</button>
                                    <button
                                        className="status-btn approved"
                                        onClick={() => updateStatus(selectedApp.id, 'approved')}
                                    >قبول</button>
                                    <button
                                        className="status-btn rejected"
                                        onClick={() => updateStatus(selectedApp.id, 'rejected')}
                                    >رفض</button>
                                </div>
                            </div>

                            <button
                                className="delete-btn"
                                onClick={() => deleteApplication(selectedApp.id)}
                            >
                                🗑️ حذف الطلب
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ApplicationsList;
