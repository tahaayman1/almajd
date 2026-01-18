import { useRef, useEffect } from 'react';

function FamilyCard({ index, onRemove, onChange, data }) {
    const dateInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const fileUiRef = useRef(null);

    useEffect(() => {
        const dateInput = dateInputRef.current;
        if (!dateInput) return;

        const openDatePicker = () => {
            try {
                dateInput.type = 'date';
                dateInput.readOnly = false;
                if (typeof dateInput.showPicker === 'function') {
                    dateInput.showPicker();
                }
            } catch (e) { }
        };

        const handleFocus = () => openDatePicker();
        const handleClick = () => {
            if (dateInput.type !== 'date') openDatePicker();
        };
        const handleBlur = () => {
            if (!dateInput.value) {
                dateInput.type = 'text';
                dateInput.readOnly = true;
            }
        };
        const handleKeydown = (e) => {
            if (dateInput.type === 'text') e.preventDefault();
        };

        dateInput.addEventListener('focus', handleFocus);
        dateInput.addEventListener('click', handleClick);
        dateInput.addEventListener('blur', handleBlur);
        dateInput.addEventListener('keydown', handleKeydown);

        return () => {
            dateInput.removeEventListener('focus', handleFocus);
            dateInput.removeEventListener('click', handleClick);
            dateInput.removeEventListener('blur', handleBlur);
            dateInput.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        const name = file ? file.name : 'لم يتم اختيار ملف';
        if (fileUiRef.current) {
            fileUiRef.current.textContent = `اختيار ملف (${name})`;
        }
        onChange('file', file);
    };

    return (
        <div className="family-card">
            <button type="button" className="remove-family" aria-label="إزالة" onClick={onRemove}>×</button>
            <h4 className="family-title">معلومات فرد العائلة {index}</h4>
            <div className="grid">
                <label className="field">
                    <span>الاسم الكامل:</span>
                    <input
                        type="text"
                        placeholder="الاسم الكامل"
                        required
                        pattern="[\u0600-\u06FFa-zA-Z ]{2,50}"
                        title="اكتب الاسم بالحروف فقط من 2 إلى 50 حرفًا"
                        value={data.fullName}
                        onChange={(e) => onChange('fullName', e.target.value)}
                    />
                </label>
                <div className="field">
                    <span>الجنس:<span className="required">*</span></span>
                    <div className="inline">
                        <label className="radio">
                            <input
                                type="radio"
                                name={`family_gender_${index}`}
                                value="female"
                                required
                                checked={data.gender === 'female'}
                                onChange={(e) => onChange('gender', e.target.value)}
                            /> أنثى
                        </label>
                        <label className="radio">
                            <input
                                type="radio"
                                name={`family_gender_${index}`}
                                value="male"
                                required
                                checked={data.gender === 'male'}
                                onChange={(e) => onChange('gender', e.target.value)}
                            /> ذكر
                        </label>
                    </div>
                </div>
                <label className="field">
                    <span>رقم الهوية:</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="رقم الهوية"
                        required
                        pattern="[0-9]{6,15}"
                        maxLength="15"
                        title="أرقام فقط من 6 إلى 15 رقمًا"
                        value={data.idNumber}
                        onChange={(e) => onChange('idNumber', e.target.value)}
                    />
                </label>
                <label className="field">
                    <span>تاريخ الميلاد:</span>
                    <input
                        ref={dateInputRef}
                        type="text"
                        className="family-date"
                        placeholder="اختر تاريخ الميلاد"
                        required
                        readOnly
                        value={data.birthDate}
                        onChange={(e) => onChange('birthDate', e.target.value)}
                    />
                </label>
                <label className="field">
                    <span>هل يوجد جواز سفر؟</span>
                    <select
                        required
                        value={data.passportStatus}
                        onChange={(e) => onChange('passportStatus', e.target.value)}
                    >
                        <option value="">اختر...</option>
                        <option>نعم</option>
                        <option>لا</option>
                        <option>منتهي الصلاحية</option>
                    </select>
                </label>
                <label className="field file">
                    <span>إرفاق صورة:</span>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="family-file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                    />
                    <div
                        ref={fileUiRef}
                        className="file-ui"
                    >
                        اختيار ملف (لم يتم اختيار ملف)
                    </div>
                </label>
                <label className="field">
                    <span>صلة القرابة:</span>
                    <select
                        required
                        value={data.relation}
                        onChange={(e) => onChange('relation', e.target.value)}
                    >
                        <option value="">صلة القرابة بمقدم الطلب</option>
                        <option>أب</option>
                        <option>أم</option>
                        <option>زوج</option>
                        <option>زوجة</option>
                        <option>ابن</option>
                        <option>ابنة</option>
                        <option>أخ</option>
                        <option>أخت</option>
                        <option>أخرى</option>
                    </select>
                    <small className="muted">تعليمات تعبئة الطلب: إذا كنت أب العائلة وتقوم بتسجيل عائلتك، عند تسجيل ابنك/ابنتك، اكتب أنه ابنك/ابنتك، وليس أنك والده.</small>
                </label>
            </div>
        </div>
    );
}

export default FamilyCard;
