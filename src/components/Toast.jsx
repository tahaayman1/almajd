import { useEffect } from 'react';

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    return (
        <div className={`toast ${type === 'error' ? 'toast-error' : 'toast-success'}`}>
            {message}
        </div>
    );
}

export default Toast;
