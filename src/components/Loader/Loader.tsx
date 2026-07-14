import "./Loader.css";

interface LoaderProps {
  message?: string;
}

export function Loader({ message = "Loading weather..." }: LoaderProps) {
  return (
    <div
      className="loader-overlay"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="loader-content">
        <div className="loader-spinner" aria-hidden="true" />
        <p>{message}</p>
      </div>
    </div>
  );
}
