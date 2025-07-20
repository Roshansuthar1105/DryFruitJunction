import StatusBadge from "./StatusBadge";

export default function MobileDataCard({ title, subtitle, status, statusVariants, action }) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div className="flex items-start space-x-3 mb-3">
        <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center font-semibold text-purple-600 flex-shrink-0">
          {title.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">{title}</div>
          <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
        </div>
      </div>
      
      <div className="mb-2">
        <span className="text-gray-500 text-xs">Status:</span>
        {typeof status === 'string' ? (
          <StatusBadge status={status} variants={statusVariants} />
        ) : (
          <div className="mt-1 space-y-1">
            {status}
          </div>
        )}
      </div>
      
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}