export const ErrorState = ({
  title = "Something went wrong",
  message = "Failed to load content. Please check your internet connection and try again.",
  onRetry,
  darkMode = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-3xl max-w-md mx-auto my-12 transition-all ${
        darkMode ? 'bg-gray-900 text-white border border-gray-800' : 'bg-white text-gray-800 shadow-xl border border-gray-100'
      }`}
      role="alert"
    >
      <div className={`p-4 rounded-full mb-4 ${darkMode ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-600'}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 rounded-full bg-red-600 text-white font-semibold text-sm shadow-md hover:bg-red-700 active:scale-95 transition-all duration-150 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Retry loading data"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
