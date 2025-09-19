export function Button({ children, className = "", onClick, size = 'default', variant = 'default' }) {
    const sizeClasses = {
      default: 'px-4 py-2 text-sm',
      sm: 'px-3 py-1.5 text-xs',
      lg: 'px-6 py-3 text-base'
    };
  
    const variantClasses = {
      default: 'bg-blue-600 hover:bg-blue-700 text-white',
      destructive: 'bg-red-600 hover:bg-red-700 text-white',
      outline: 'border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-100',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-800',
      link: 'bg-transparent text-blue-600 hover:underline'
    };
  
    return (
      <button
        className={`rounded-lg font-semibold transition-colors duration-200 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
