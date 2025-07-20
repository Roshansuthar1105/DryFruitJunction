import { Star, Award, Clock } from "lucide-react"
import { Link } from "react-router-dom";
// Update Hero.jsx
import TestimonialCarousel from './TestimonialCarousel'
export default function Hero() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
                  Handcrafted
                </span>
                <br />
                <span className="text-gray-800">Dry Fruit Delights</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Indulge in our artisan-made dry fruit sweets, crafted with premium ingredients and generations of family
                recipes from Jodhpur. Every bite tells a story of passion and tradition.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <div className="bg-pink-100 p-2 rounded-full">
                  <Award className="h-5 w-5 text-pink-600" />
                </div>
                <span className="text-gray-700 font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-pink-100 p-2 rounded-full">
                  <Star className="h-5 w-5 text-pink-600" />
                </div>
                <span className="text-gray-700 font-medium">100% Natural</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-pink-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-pink-600" />
                </div>
                <span className="text-gray-700 font-medium">Made Fresh</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="bg-gradient-to-r from-pink-500 to-pink-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
                Shop Our Sweets
              </Link>
              <Link to="/about" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-pink-500 hover:text-pink-600 transition-all duration-300 text-center">
                Our Story
              </Link>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            
            {/* <div className="relative z-10 px-5 ">
              <img
                src="https://img.freepik.com/free-photo/nagpur-orange-burfee-barfi-burfi-is-creamy-fudge-made-with-fresh-oranges-mawa_466689-72287.jpg?ga=GA1.1.429237435.1750599163&semt=ais_hybrid&w=740"
                alt="Premium dry fruit sweets from DryFruit Junction"
                width={500}
                height={600}
                className="rounded-3xl shadow-2xl w-full max-h-[70dvh] object-cover"
              />
            </div> */}
            <TestimonialCarousel/>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-pink-200 to-pink-300 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-r from-pink-100 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}