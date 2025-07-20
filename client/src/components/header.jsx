// src/components/header.jsx
import { useState } from "react"
import { Menu, X, ShoppingBag, Heart, User, LogIn, Home, Box, Truck, Settings } from "lucide-react";
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { cartCount } = useCart()

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg sticky w-full left-0 top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
              <img src="logo.png" alt="Logo" width={40} height={40} />
            {/* <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-2 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div> */}
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              DryFruit Junction
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-pink-600 transition-colors font-medium flex items-center">
            Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
              Products
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
                Admin
              </Link>
            )}
            {user?.role === 'delivery' && (
              <Link to="/delivery" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
                Delivery
              </Link>
            )}
            {/* Conditional auth links */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center text-gray-700 hover:text-pink-600 transition-colors">
                  {user ? user.firstName : "Account"}
                </Link>
                <button
                  onClick={logout}
                  className="cursor-pointer text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center bg-pink-500 text-white py-1 px-2 rounded-4xl hover:bg-gray-600 transition-colors">
                  <LogIn className="h-5 w-5 mr-1" />
                  Login
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center text-gray-700 hover:text-pink-600 transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Navigation Icons (Cart + Menu) */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative flex items-center text-gray-700 hover:text-pink-600 transition-colors"
              onClick={closeMenu}
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className="p-2 cursor-pointer hover:text-pink-600" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-pink-600 transition-colors font-medium flex items-center "
                onClick={closeMenu}
              >
                <Home className="h-5 w-5 mr-3" />
            Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-pink-600 transition-colors font-medium flex items-center"
                onClick={closeMenu}
              >
                <Box className="h-5 w-5 mr-3" />
                Products
              </Link>

              {/* Conditional auth links */}
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="text-gray-700 hover:text-pink-600 transition-colors font-medium flex items-center"
                  onClick={closeMenu}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Admin Pannel
                </Link>
              )}
              {user?.role === 'delivery' && (
                <Link 
                  to="/delivery" 
                  className="text-gray-700 hover:text-pink-600 transition-colors font-medium flex items-center"
                  onClick={closeMenu}
                >
                  <Truck className="h-5 w-5 mr-3" />
                  Delivery Pannel
                </Link>
              )}
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-700 hover:text-pink-600 transition-colors font-medium flex items-center"
                    onClick={closeMenu}
                  >
                    <User className="h-5 w-5 mr-3"/>
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      closeMenu()
                    }}
                    className="text-gray-700 cursor-pointer hover:text-pink-600 transition-colors font-medium flex items-center text-left"
                  >
                    <LogIn className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-pink-600 transition-colors font-medium flex items-center"
                    onClick={closeMenu}
                  ><LogIn className="h-5 w-5 mr-3" />
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="text-gray-700 hover:text-pink-600 transition-colors font-medium flex items-center"
                    onClick={closeMenu}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}