import "./Notification.css";

interface NotificationProps {
  message: string;
  type?: "success" | "error";
  onClose?: () => void;
}

export function Notification({
  message,
  type = "success",
  onClose,
}: NotificationProps) {
  return (
    <div className={`notification notification-${type}`} role="alert">
      <span>{message}</span>

      {onClose && (
        <button type="button" className="notification-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}
