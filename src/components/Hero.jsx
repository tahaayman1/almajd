function Hero() {
    return (
        <section className="hero">
            <div className="hero-bg"></div>
            <div className="container hero-content">
                <div className="badge">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="heart-icon"
                    >
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            fill="none"
                        />
                    </svg>
                    <span>الإجلاء الإنساني</span>
                </div>
                <h1 className="hero-title">
                    لأهل غزة الصامدين...<br />
                    لستم وحدكم
                </h1>
                <p className="hero-sub">
                    في ظل القصف، وتحت الأنقاض، هناك من ما زال يؤمن أن الحياة تستحق فرصة
                    أخرى. جئنا لمدّ يد العون، ونفتح لكم بابًا نحو الأمان.
                </p>

                <div className="cards">
                    <div className="card glass">
                        <div className="icon">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="none"
                                />
                            </svg>
                        </div>
                        <h3>الدعم الإنساني</h3>
                        <p>
                            إحنا بنساعد الأفراد والعائلات على الإجلاء الآمن من مناطق الحرب
                            والنزاع، ونضمن الكرامة والحماية طوال الطريق.
                        </p>
                    </div>
                    <div className="card glass">
                        <div className="icon">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M12 8v4l3 3"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <h3>فرص جديدة</h3>
                        <p>
                            إحنا بنوفر طرق وفرص للناس يسافروا، ويستقروا بدول آمنة، ويبنو
                            مستقبل مستقر.
                        </p>
                    </div>
                    <div className="card glass">
                        <div className="icon">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <circle
                                    cx="12"
                                    cy="7"
                                    r="4"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                            </svg>
                        </div>
                        <h3>الاستقرار والراحة</h3>
                        <p>
                            إحنا بنساعد الناس اللي تهجروا يوصلوا للرعاية الصحية، والدعم
                            النفسي، والخدمات الأساسية بفترة الانتقال.
                        </p>
                    </div>
                </div>

                <a href="#form" className="btn-primary">سجل الآن للحصول على المساعدة</a>
            </div>
        </section>
    );
}

export default Hero;
