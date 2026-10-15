import { useStore } from '../context';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (!toasts.length) return null;

  return (
    <div className="toast-portal" aria-live="polite">
      {toasts.map(toast => {
        const Icon =
          toast.type === 'error' || toast.type === 'warning'
            ? AlertCircle
            : toast.type === 'info'
            ? Info
            : CheckCircle2;

        return (
          <div key={toast.id} className={`toast-bubble toast-${toast.type}`}>
            <Icon size={18} className="toast-icon" />
            <span className="toast-text">{toast.text}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="toast-close"
              aria-label="Dismiss message"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
