// src/components/VisitorCounter.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const VisitorCounter = ({ location = 'footer' }) => {
  const [count, setCount] = useState(null);
  const { BACKEND_API } = useAuth();

  useEffect(() => {
    const updateCounter = async () => {
      try {
        const endpoint =
          location === 'home'
            ? `${BACKEND_API}/api/visitors`
            : `${BACKEND_API}/api/visitors/count`;
        const method = location === 'home' ? 'post' : 'get';

        const response = await axios[method](endpoint);
        if (response.data.success) {
          setCount(response.data.count);
        }
      } catch (error) {
        console.error('Error updating visitor count:', error);
      }
    };

    updateCounter();
  }, [location]);

  if (count === null) return null;

  const baseStyles =
    location === 'footer'
      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm px-4 py-1 rounded-full shadow-md border border-white/20'
      : 'text-white bg-pink-600 px-3 py-1 rounded-full';

  return (
    <div className={baseStyles}>
      {location === 'footer' && <span className="font-medium">👁️ Total Visitors: </span>}
      <span className="font-semibold">{count.toLocaleString()}</span>
    </div>
  );
};

export default VisitorCounter;
