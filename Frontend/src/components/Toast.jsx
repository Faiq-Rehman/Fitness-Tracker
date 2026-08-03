import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div className={`toastContainer toast-${type}`} role="alert">
      <div className="toastIcon">
        {isSuccess && <CheckCircle size={22} className="icon-success" />}
        {isError && <AlertCircle size={22} className="icon-error" />}
        {!isSuccess && !isError && <Info size={22} className="icon-info" />}
      </div>

      <div className="toastContent">
        <h4 className="toastTitle">
          {isSuccess ? 'Success' : isError ? 'Error' : 'Notification'}
        </h4>
        <p className="toastMessage">{message}</p>
      </div>

      <button type="button" className="toastClose" onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>

      <div className="toastProgress">
        <div className="toastProgressBar" style={{ animationDuration: `${duration}ms` }} />
      </div>
    </div>
  );
}
