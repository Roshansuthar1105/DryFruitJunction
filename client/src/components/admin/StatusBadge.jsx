const colorClasses = {
  purple: 'bg-purple-100 text-purple-800',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  orange: 'bg-orange-100 text-orange-800',
  gray: 'bg-gray-100 text-gray-800',
};

export default function StatusBadge({ status, variants = {} }) {
  // Determine color based on status and variants mapping
  const statusKey = typeof status === 'string' ? status.toLowerCase() : '';
  const color = variants[statusKey] || 'gray';
  
  return (
    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      {status}
    </span>
  );
}