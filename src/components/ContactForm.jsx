import { useState, useRef, useEffect } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import FamilyCard from './FamilyCard';
import CountrySelect from './CountrySelect';

function ContactForm({ onShowToast, onShowUpload }) {
    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        idNumber: '',
        birthDate: '',
        phone: '',
        email: '',
        passportStatus: '',
        destinationCountry: '',
        mainFile: null,
        hasPreviousRegistration: '',
        previousWhen: '',
        reRegistrationReason: '',
        otherReason: '',
        notRobot: false
    });

    const [familyMembers, setFamilyMembers] = useState([]);
    const [familyCount, setFamilyCount] = useState(0);

    const formRef = useRef(null);
    const dateInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const fileUiRef = useRef(null);
    const submitBtnRef = useRef(null);


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
        setFormData(prev => ({ ...prev, mainFile: file }));
    };

    const handleAddFamily = () => {
        const newIndex = familyCount + 1;
        setFamilyCount(newIndex);
        setFamilyMembers(prev => [...prev, {
            id: newIndex,
            fullName: '',
            gender: '',
            idNumber: '',
            birthDate: '',
            passportStatus: '',
            destinationCountry: '',
            relation: '',
            file: null
        }]);
    };

    const handleRemoveFamily = (id) => {
        setFamilyMembers(prev => prev.filter(member => member.id !== id));
    };

    const handleFamilyChange = (id, field, value) => {
        setFamilyMembers(prev => prev.map(member =>
            member.id === id ? { ...member, [field]: value } : member
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formRef.current?.checkValidity() || !formData.notRobot) {
            return;
        }

        onShowUpload(true);
        document.body.classList.add('no-scroll', 'uploading');

        try {

            const familyData = familyMembers.map(({ file, ...rest }) => rest);


            const compressImage = async (file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (event) => {
                        const img = new Image();
                        img.src = event.target.result;
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 800;
                            const scaleSize = MAX_WIDTH / img.width;
                            canvas.width = MAX_WIDTH;
                            canvas.height = img.height * scaleSize;

                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);


                            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                            resolve(compressedBase64);
                        };
                    };
                });
            };


            let mainFileBase64 = null;
            const familyFileBase64s = [];


            if (formData.mainFile) {
                mainFileBase64 = await compressImage(formData.mainFile);
            }


            for (let i = 0; i < familyMembers.length; i++) {
                if (familyMembers[i].file) {
                    const fileBase64 = await compressImage(familyMembers[i].file);
                    familyFileBase64s.push({ memberId: familyMembers[i].id, base64: fileBase64 });
                }
            }


            const applicationData = {
                fullName: formData.fullName,
                gender: formData.gender,
                idNumber: formData.idNumber,
                birthDate: formData.birthDate,
                phone: formData.phone,
                email: formData.email,
                passportStatus: formData.passportStatus,
                destinationCountry: formData.destinationCountry,


                hasPreviousRegistration: formData.hasPreviousRegistration,
                previousWhen: formData.previousWhen || null,
                reRegistrationReason: formData.reRegistrationReason || null,
                otherReason: formData.otherReason || null,


                mainFileBase64: mainFileBase64,

                familyMembers: familyData.map(member => {
                    const fileInfo = familyFileBase64s.find(f => f.memberId === member.id);
                    return {
                        ...member,
                        fileBase64: fileInfo ? fileInfo.base64 : null
                    };
                }),

                status: 'pending',
                createdAt: Timestamp.now()
            };


            const savePromise = addDoc(collection(db, 'applications'), applicationData);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('انتهت مهلة الاتصال. تأكد من إعداد Firebase بشكل صحيح.')), 10000)
            );

            await Promise.race([savePromise, timeoutPromise]);

            onShowToast('تم استلام طلبك بنجاح سيتم مراجعة البيانات والتواصل معك باقرب وقت ممكن', 'success');


            setFormData({
                fullName: '',
                gender: '',
                idNumber: '',
                birthDate: '',
                phone: '',
                email: '',
                passportStatus: '',
                destinationCountry: '',
                mainFile: null,
                hasPreviousRegistration: '',
                previousWhen: '',
                reRegistrationReason: '',
                otherReason: '',
                notRobot: false
            });
            setFamilyMembers([]);

            if (dateInputRef.current) {
                dateInputRef.current.type = 'text';
                dateInputRef.current.readOnly = true;
            }
            if (fileUiRef.current) {
                fileUiRef.current.textContent = 'اختيار ملف (لم يتم اختيار ملف)';
            }

            formRef.current?.reset();
        } catch (err) {
            console.error('Error submitting form:', err);

            let errorMessage = 'حدث خطأ أثناء إرسال الطلب. ';

            if (err.message.includes('timeout') || err.message.includes('مهلة')) {
                errorMessage += 'الرجاء التأكد من إعداد Firebase Firestore في لوحة التحكم.';
            } else if (err.code === 'permission-denied') {
                errorMessage += 'تأكد من إعداد قواعد الأمان في Firebase.';
            } else if (err.message.includes('network')) {
                errorMessage += 'تحقق من الاتصال بالإنترنت.';
            } else {
                errorMessage += err.message || 'خطأ غير معروف';
            }

            onShowToast(errorMessage, 'error');
        } finally {
            onShowUpload(false);
            document.body.classList.remove('no-scroll', 'uploading');
        }
    };

    const isFormValid = formRef.current?.checkValidity() && formData.notRobot;

    return (
        <section id="form">
            <div className="container-inner">
                <div className="notice">
                    <div className="notice-bar"></div>
                    <div className="notice-text">
                        الخدمة التي نقدمها متاحة فقط لسكان غزة الموجودين داخل قطاع غزة فقط!
                    </div>
                </div>

                <h2 className="form-title">
                    هل تطمح للسفر وبداية حياة جديدة؟ نحن هنا لمساعدتك!
                </h2>

                <form ref={formRef} className="form card" onSubmit={handleSubmit}>
                    <h3 className="form-section">المعلومات الأساسية</h3>
                    <div className="grid">
                        <label className="field">
                            <span>الاسم الكامل:</span>
                            <input
                                type="text"
                                name="full_name"
                                placeholder="اكتب اسمك الرباعي"
                                required
                                pattern="[\u0600-\u06FFa-zA-Z\s]{2,50}"
                                title="اكتب الاسم بالحروف فقط من 2 إلى 50 حرفًا"
                                value={formData.fullName}
                                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                            />
                        </label>
                        <div className="field">
                            <span>الجنس:<span className="required">*</span></span>
                            <div className="inline">
                                <label className="radio">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        required
                                        checked={formData.gender === 'female'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                    /> أنثى
                                </label>
                                <label className="radio">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        required
                                        checked={formData.gender === 'male'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                    /> ذكر
                                </label>
                            </div>
                        </div>
                        <label className="field">
                            <span>رقم الهوية:</span>
                            <input
                                type="text"
                                name="id_number"
                                inputMode="numeric"
                                placeholder="رقم الهوية"
                                required
                                pattern="[0-9]{6,15}"
                                maxLength="15"
                                title="أرقام فقط من 6 إلى 15 رقمًا"
                                value={formData.idNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                            />
                        </label>
                        <label className="field">
                            <span>تاريخ الميلاد:</span>
                            <input
                                ref={dateInputRef}
                                name="birth_date"
                                type="text"
                                placeholder="اختر تاريخ الميلاد"
                                required
                                readOnly
                                value={formData.birthDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                            />
                        </label>
                        <label className="field">
                            <span>رقم الهاتف:</span>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="رقم الهاتف للتواصل"
                                required
                                inputMode="tel"
                                pattern="[0-9+\- ]{7,20}"
                                maxLength="20"
                                title="أرقام، + ، مسافات أو شرطات من 7 إلى 20 محرف"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </label>
                        <label className="field">
                            <span>البريد الإلكتروني:</span>
                            <input
                                type="email"
                                name="email"
                                placeholder="عنوان البريد الإلكتروني"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </label>
                        <label className="field">
                            <span>هل يوجد جواز سفر؟</span>
                            <select
                                name="passport_status"
                                required
                                value={formData.passportStatus}
                                onChange={(e) => setFormData(prev => ({ ...prev, passportStatus: e.target.value }))}
                            >
                                <option value="">اختر...</option>
                                <option>نعم</option>
                                <option>لا</option>
                                <option>منتهي الصلاحية</option>
                            </select>
                        </label>
                        <label className="field" style={{ position: 'relative' }}>
                            <span>الوجهة المفضلة للسفر:</span>
                            <CountrySelect
                                value={formData.destinationCountry}
                                onChange={(value) => setFormData(prev => ({ ...prev, destinationCountry: value }))}
                                required
                            />
                        </label>
                        <label className="field file">
                            <span>إرفاق صورة:</span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                name="main_file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                            />
                            <div
                                ref={fileUiRef}
                                className="file-ui"
                            >
                                اختيار ملف (لم يتم اختيار ملف)
                            </div>
                            <small className="muted">
                                يرجى إرفاق صورة جواز السفر، أو بطاقة الهوية في حال عدم توفر صورة الجواز.
                            </small>
                        </label>
                    </div>

                    <div className="field" style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
                        <span>هل سبق وقدمت طلب تسجيل عبر موقعنا؟ <span className="required">*</span></span>
                        <div className="inline">
                            <label className="radio">
                                <input
                                    type="radio"
                                    name="has_previous_registration"
                                    value="yes"
                                    required
                                    checked={formData.hasPreviousRegistration === 'yes'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, hasPreviousRegistration: e.target.value }))}
                                /> نعم
                            </label>
                            <label className="radio">
                                <input
                                    type="radio"
                                    name="has_previous_registration"
                                    value="no"
                                    required
                                    checked={formData.hasPreviousRegistration === 'no'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, hasPreviousRegistration: e.target.value }))}
                                /> لا
                            </label>
                        </div>
                    </div>

                    {formData.hasPreviousRegistration === 'yes' && (
                        <>
                            <label className="field" style={{ gridColumn: '1 / -1' }}>
                                <span>متى كان تقريباً؟</span>
                                <select
                                    required
                                    value={formData.previousWhen}
                                    onChange={(e) => setFormData(prev => ({ ...prev, previousWhen: e.target.value }))}
                                >
                                    <option value="">اختر...</option>
                                    <option>خلال أسبوع</option>
                                    <option>خلال شهر</option>
                                    <option>خلال 3 أشهر</option>
                                    <option>خلال 6 أشهر</option>
                                    <option>أكثر من 6 أشهر</option>
                                </select>
                            </label>

                            <label className="field" style={{ gridColumn: '1 / -1' }}>
                                <span>سبب إعادة التسجيل (اختياري):</span>
                                <select
                                    value={formData.reRegistrationReason}
                                    onChange={(e) => setFormData(prev => ({ ...prev, reRegistrationReason: e.target.value }))}
                                >
                                    <option value="">اختر...</option>
                                    <option>لم يتم التواصل معي</option>
                                    <option>تحديث البيانات</option>
                                    <option>إضافة أفراد جدد</option>
                                    <option>سبب آخر</option>
                                </select>
                            </label>

                            {formData.reRegistrationReason === 'سبب آخر' && (
                                <label className="field" style={{ gridColumn: '1 / -1' }}>
                                    <span>سبب آخر:</span>
                                    <input
                                        type="text"
                                        placeholder="اذكر السبب..."
                                        value={formData.otherReason}
                                        onChange={(e) => setFormData(prev => ({ ...prev, otherReason: e.target.value }))}
                                    />
                                </label>
                            )}
                        </>
                    )}

                    <div id="familyArea" className="family-area">
                        {familyMembers.map((member, idx) => (
                            <FamilyCard
                                key={member.id}
                                index={idx + 1}
                                data={member}
                                onRemove={() => handleRemoveFamily(member.id)}
                                onChange={(field, value) => handleFamilyChange(member.id, field, value)}
                            />
                        ))}
                        <p className="family-add">
                            يمكنكم أيضًا إضافة أفراد العائلة ضمن الاستمارة.
                            <button type="button" className="text-link" onClick={handleAddFamily}>
                                اضغط هنا
                            </button>
                        </p>
                    </div>

                    <div className="field checkbox">
                        <div className="recaptcha">
                            <div className="recaptcha-box">
                                <input
                                    type="checkbox"
                                    id="notRobot"
                                    required
                                    checked={formData.notRobot}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notRobot: e.target.checked }))}
                                />
                                <label htmlFor="notRobot">أنا لست برنامج روبوت</label>
                                <img
                                    src="/recaptcha_logo.png"
                                    alt="reCAPTCHA"
                                    className="recaptcha-logo"
                                />
                            </div>
                            <div className="recaptcha-note">الخصوصية – البنود</div>
                        </div>
                    </div>

                    <button
                        ref={submitBtnRef}
                        type="submit"
                        className="btn-submit"
                        disabled={!isFormValid}
                    >
                        إرسال
                    </button>
                </form>
            </div>
        </section>
    );
}

export default ContactForm;
