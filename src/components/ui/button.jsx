export function Button({ children, className = "", onClick }) {
    return (
      <button
        className={`px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  