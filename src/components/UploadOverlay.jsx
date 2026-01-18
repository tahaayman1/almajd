function UploadOverlay({ isVisible }) {
    if (!isVisible) return null;

    return (
        <div className="upload-overlay" style={{ display: 'grid' }}>
            <div className="upload-card">
                <div className="upload-spinner" aria-hidden="true"></div>
                <h3 className="upload-title">جارٍ رفع المرفقات وإرسال الطلب</h3>
                <p className="upload-note">يرجى عدم مغادرة الصفحة حتى يكتمل التحميل.</p>
            </div>
        </div>
    );
}

export default UploadOverlay;
