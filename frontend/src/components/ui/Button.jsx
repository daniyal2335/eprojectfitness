export function Button({ children, className, ...props }) {
  return <button className={`bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ${className}`} {...props}>{children}</button>;
}
