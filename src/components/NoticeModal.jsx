import { useEffect } from 'react';

function NoticeModal({ isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');

            const handleEscape = (e) => {
                if (e.key === 'Escape') onClose();
            };

            document.addEventListener('keydown', handleEscape);
            return () => {
                document.body.classList.remove('no-scroll');
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-card">
                <h3 className="modal-title">
                    <span aria-hidden="true">📢</span> تنويه هام بخصوص التنسيق ودفع الرسوم
                </h3>
                <p className="modal-hello">أعزاؤنا الكرام،</p>
                <p className="modal-lead">
                    لضمان سير إجراءات التنسيق بشكل صحيح وسليم، نرجو العلم بأن التواصل
                    الرسمي لدفع الرسوم سيكون فقط عبر الأرقام التالية:
                </p>

                <div className="modal-box">
                    <p>📞 <strong>الأستاذ مؤيد</strong>:</p>
                    <p className="tel"><a href="tel:+972557237624">+972557237624</a></p>

                    <p>📞 <strong>الأستاذ عمر</strong>:</p>
                    <p className="tel"><a href="tel:+972557053144">+972557053144</a></p>

                    <p>
                        📞
                        <strong>رقم المؤسسة المعتمد لتأكيد التنسيق واستقبال إشعار الدفع:</strong>
                    </p>
                    <p className="tel"><a href="tel:+972557237624">+972557237624</a></p>
                    <p className="tel"><a href="tel:+972557053144">+972557053144</a></p>
                </div>

                <p className="modal-warn">
                    يرجى عدم التعامل مع أي أرقام أخرى تمامًا، وأي إشعار دفع يجب إرساله
                    حصريًا إلى الرقم المذكور أعلاه لضمان تثبيت تنسيقكم بشكل صحيح.
                </p>

                <hr className="modal-sep" />
                <p className="modal-thanks">
                    شكرًا لكم تعاونكم وثقتكم.<br />مع المحبة والتقدير<br />مؤسسة المجد
                    للإغاثة الإنسانية
                </p>

                <button type="button" className="btn-modal" onClick={onClose}>إغلاق</button>
            </div>
        </div>
    );
}

export default NoticeModal;
