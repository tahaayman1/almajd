import { useState, useRef, useEffect } from 'react';

const countries = [
    { code: 'GB', name: 'بريطانيا' },
    { code: 'BE', name: 'بلجيكا' },
    { code: 'ZA', name: 'جنوب افريقيا' },
    { code: 'ES', name: 'اسبانيا' },
    { code: 'ID', name: 'اندونيسيا' },
    { code: 'IT', name: 'ايطاليا' },
    { code: 'DE', name: 'المانيا' },
    { code: 'FR', name: 'فرنسا' },
    { code: 'MY', name: 'ماليزيا' },
    { code: 'CA', name: 'كندا' },
    { code: 'CH', name: 'سويسرا' },
    { code: 'NL', name: 'هولندا' },
    { code: 'AU', name: 'استراليا' }
];

function CountrySelect({ value, onChange, required }) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCountry = countries.find(c => c.code.toLowerCase() === value);

    return (
        <div className="custom-select" ref={wrapperRef} style={{ position: 'relative' }}>
            <input type="hidden" name="destination_country" value={value} required={required} />
            <div
                className="custom-select-trigger"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    cursor: 'pointer',
                    padding: '0.9rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    fontSize: '1rem'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {selectedCountry ? (
                        <>
                            <img
                                src={`https://flagsapi.com/${selectedCountry.code}/flat/32.png`}
                                alt={selectedCountry.name}
                                style={{ width: '24px', height: '18px', objectFit: 'cover', borderRadius: '2px' }}
                            />
                            <span>{selectedCountry.name}</span>
                        </>
                    ) : (
                        <span style={{ opacity: 0.6 }}>اختر الوجهة...</span>
                    )}
                </div>
                <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
            </div>

            {isOpen && (
                <div
                    className="custom-select-options"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {countries.map((country) => (
                        <div
                            key={country.code}
                            onClick={() => {
                                onChange(country.code.toLowerCase());
                                setIsOpen(false);
                            }}
                            style={{
                                padding: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'background 0.2s',
                                background: value === country.code.toLowerCase() ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = value === country.code.toLowerCase() ? 'rgba(59, 130, 246, 0.2)' : 'transparent'}
                        >
                            <img
                                src={`https://flagsapi.com/${country.code}/flat/32.png`}
                                alt={country.name}
                                style={{ width: '24px', height: '18px', objectFit: 'cover', borderRadius: '2px' }}
                            />
                            <span>{country.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CountrySelect;
