import { useApp } from '../context/AppContext';
import './ToastNotification.css';

const ToastNotification = () => {
  const { toast } = useApp();

  return (
    <div className={`toast-wrap ${toast.show ? 'show' : ''} toast-${toast.type}`}>
      <span className="toast-icon">{toast.type === 'error' ? '✕' : '✓'}</span>
      <span className="toast-msg">{toast.message}</span>
    </div>
  );
};

export default ToastNotification;
