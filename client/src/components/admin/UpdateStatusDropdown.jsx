export default function UpdateStatusDropdown({ currentStatus, options, onUpdate, className = '' }) {
    return (
      <select
        value={currentStatus}
        onChange={(e) => onUpdate(e.target.value)}
        className={`cursor-pointer border border-gray-300 rounded-md px-2 py-1 text-sm ${className}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    );
  }