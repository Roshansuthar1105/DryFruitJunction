// src="https://img.freepik.com/free-photo/various-cakes-supermarket-shelves-sale_627829-7332.jpg?ga=GA1.1.1303647263.1750324999&semt=ais_hybrid&w=740"
// About.jsx
import { useState } from 'react';
import { Users, Award, Heart, Clock } from "lucide-react"
import BrandStory from './BrandStory';

export default function About() {
  const [showBrandStory, setShowBrandStory] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showBrandStory && <BrandStory onClose={() => setShowBrandStory(false)} />}
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">
                Our Sweet{" "}
                <span className="bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
                  Revolution
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                From our family-run kitchen in Jodhpur, Rajasthan, we're bringing back the purity and richness of traditional dry fruit sweets. What started as a small home operation during COVID has grown into a beloved brand, but our commitment to quality remains unchanged.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every sweet we create is made with premium dry fruits sourced from trusted suppliers, combined with time-honored techniques passed down through our family. We believe that the best sweets come from the heart, and that's exactly what you'll taste in every bite.
              </p>
              
              <button
                onClick={() => setShowBrandStory(true)}
                className="mt-4 cursor-pointer bg-gradient-to-r from-pink-500 to-pink-700 text-white px-6 py-3 rounded-full text-md font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Read Our Full Story
              </button>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-pink-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">10,000+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-pink-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">25+</div>
                <div className="text-gray-600">Awards Won</div>
              </div>
            </div> */}
          </div>
          {/* Right Content */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://img.freepik.com/free-photo/various-cakes-supermarket-shelves-sale_627829-7332.jpg?ga=GA1.1.1303647263.1750324999&semt=ais_hybrid&w=740"
                alt="Our dry fruit sweets being prepared in Jodhpur"
                width={600}
                height={500}
                className="rounded-3xl shadow-2xl"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-pink-200 to-pink-300 rounded-full opacity-30"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-pink-100 to-pink-200 rounded-full opacity-30"></div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Values</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-pink-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Made with Love</h4>
              <p className="text-gray-600">
                Every sweet is crafted with passion and care, ensuring that love is the secret ingredient in everything we make.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-pink-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Premium Quality</h4>
              <p className="text-gray-600">
                We source only the finest dry fruits and maintain the highest standards in every step of our production process.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-pink-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Fresh Daily</h4>
              <p className="text-gray-600">
                Our sweets are made fresh after every order to ensure you always receive the best taste and quality possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}