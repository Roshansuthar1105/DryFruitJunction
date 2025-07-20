// BrandStory.jsx
import { X } from 'lucide-react';

export default function BrandStory({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose}
          className=" cursor-pointer absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
        
        <div className="p-8">
          <h2 className="text-3xl font-bold text-pink-900 mb-6 text-center">
            Our Sweet Revolution from the Heart of Rajasthan
          </h2>
          
          <div className="space-y-6 text-gray-700">
            <p>
              In a country where sweets mark every celebration, most packaged mithai on the market today fail to match the purity and richness we grew up loving. As a foodie and son of a hospitality family, I couldn't ignore this decline in quality anymore.
            </p>
            
            <p>
              That's when <strong>DryFruit Junction</strong> was born - from our family-run kitchen in Jodhpur, Rajasthan. A brand that blends purity, premium dry fruits, and the richness of handmade tradition.
            </p>
            
            <p>
              It all began with our <strong>besan chakki</strong>, made fresh in pure desi ghee and khoya, served straight from our home kitchen during the post-COVID craving for real mithai. Since then, we've grown - but our values remain unchanged.
            </p>
            
            <h3 className="text-xl font-bold text-pink-800 mt-8 mb-4">
              Our Signature Sweets
            </h3>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-pink-100 p-1 rounded-full mr-3 mt-1">
                  <svg className="h-4 w-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span><strong>Kaju Katli</strong> - Classic and flavored varieties (Mango, Strawberry, Blueberry, Kesar)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-pink-100 p-1 rounded-full mr-3 mt-1">
                  <svg className="h-4 w-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span><strong>Panch Mewa Chakki</strong> - A royal blend of 5 premium dry fruits</span>
              </li>
            </ul>
            
            <div className="mt-8 p-6 bg-pink-50 rounded-xl">
              <p className="text-center text-pink-900 font-medium italic">
                "Welcome to DryFruit Junction. Taste once. Trust forever."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}