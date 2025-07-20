// src/components/ScrollToTopButton.jsx
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="cursor-pointer bg-pink-600/40 hover:bg-pink-700 backdrop-blur-sm text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}