export function Card({ children, className = "" }) {
    return <div className={`border rounded-lg p-4 shadow-md bg-white ${className}`}>{children}</div>;
  }
  
  export function CardContent({ children }) {
    return <div className="p-4">{children}</div>;
  }
  