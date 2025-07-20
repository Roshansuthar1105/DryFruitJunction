// import Link from "next/link"
import { Heart, Facebook, Instagram, Twitter, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import VisitorCounter from './VisitorCounter';
// Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="logo.png" alt="Logo" width={40} height={40} />
              {/* <div className="bg-gradient-to-r from-pink-500 to-pink-700 p-2 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div> */}

              <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
                DryFruit Junction
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Crafting exceptional dry fruit sweets with love and tradition from the heart of Rajasthan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-pink-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Sweets</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products/6856ca7e1e56cf367abff549" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Kaju Katli
                </Link>
              </li>
              <li>
                <Link to="/products/6856c9511e56cf367abff535" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Mango Kaju Katli
                </Link>
              </li>
              <li>
                <Link to="/products/6856c4911e56cf367abff3f1" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Strawberry Kaju Katli
                </Link>
              </li>
              <li>
                <Link to="/products/6856cbb11e56cf367abff555" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Panch Mewa Burfi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Custom Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <p>Omni Ecomm Services Pvt Ltd</p>
              <p>Santosh Bhawan, Gehloto Ka Bas, Magra Poonjala, Jodhpur</p>
              <p>Manufacturing Facility: Hotel Omni Plaza, B2, Maan Ji Ka Hattha, Paota, Jodhpur</p>
              <p>Contact: Pooran Singh Gehlot</p>
              <p>Phone: +91-9116009307</p>
            </div>
            {/* <div className="mt-4">
    <h4 className="font-semibold text-white mb-2">Order Hours</h4>
    <div className="text-sm text-gray-400 space-y-1">
      <p>Mon-Sun: 8AM - 8PM</p>
      <p>Fresh sweets made after every order</p>
    </div>
  </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} DryFruit Junction. All rights reserved.</p>
          {/* <VisitorCounter location="footer" /> */}
          <VisitorCounter location="footer" />
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}