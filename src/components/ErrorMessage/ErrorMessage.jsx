import "./ErrorMessage.css";

function ErrorMessage({
  title = "Something went wrong",
  message = "Please try again later.",
  onRetry,
}) {
  return (
    <div className="error-box">

      <h2>{title}</h2>

      <p>{message}</p>

      {onRetry && (
        <button onClick={onRetry}>
          Retry
        </button>
      )}

    </div>
  );
}

export default ErrorMessage;