import React, { Suspense, lazy, useEffect } from 'react';
import {  Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import Loading from './components/Loading.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTopButton from './components/ScrollToTopButton.jsx';
import { PrivacyPolicy } from './pages/PrivacyPolicy.jsx';
import { TermsAndConditions } from './pages/TermsAndConditions.jsx';

// Lazy load main components
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const About = lazy(() => import('./components/about.jsx'));
const Contact = lazy(() => import('./components/contact.jsx'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const DeliveryDashboard = lazy(() => import('./pages/DeliveryDashboard'));
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));
const DeliveryRoutes = lazy(() => import('./routes/DeliveryRoutes'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Create a wrapper component to handle layout
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDeliveryRoute = location.pathname.startsWith('/delivery');

  return (
    <>
      {!isAdminRoute && !isDeliveryRoute && <Header />}
      {children}
      {!isAdminRoute && !isDeliveryRoute && <Footer />}
    </>
  );
};

function App() {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: adds smooth scrolling animation
    });
  }, [location.pathname]); // Trigger effect when pathname changes

  return (
    <div className="app">
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <Suspense fallback={<Loading />}>
              <ScrollToTopButton/>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={
                    <LayoutWrapper>
                      <HomePage />
                    </LayoutWrapper>
                  } />
                  <Route path="/products" element={
                    <LayoutWrapper>
                      <ProductsPage />
                    </LayoutWrapper>
                  } />
                  <Route path="/products/:id" element={
                    <LayoutWrapper>
                      <ProductPage />
                    </LayoutWrapper>
                  } />
                  <Route path="/login" element={
                    <LayoutWrapper>
                      <Login />
                    </LayoutWrapper>
                  } />
                  <Route path="/signup" element={
                    <LayoutWrapper>
                      <Signup />
                    </LayoutWrapper>
                  } />
                  <Route path="/cart" element={
                    <LayoutWrapper>
                      <CartPage />
                    </LayoutWrapper>
                  } />
                  <Route path="/about" element={
                    <LayoutWrapper>
                      <About />
                    </LayoutWrapper>
                  } />
                  <Route path="/contact" element={
                    <LayoutWrapper>
                      <Contact />
                    </LayoutWrapper>
                  } />
                  <Route path="/privacy" element={
                    <LayoutWrapper>
                      <PrivacyPolicy />
                    </LayoutWrapper>
                  } />
                  <Route path="/terms" element={
                    <LayoutWrapper>
                      <TermsAndConditions />
                    </LayoutWrapper>
                  } />

                  {/* Protected Routes */}
                  <Route path="/checkout" element={
                    <LayoutWrapper>
                      <ProtectedRoute allowedRoles={['user', 'admin', 'delivery']}>
                        <CheckoutPage />
                      </ProtectedRoute>
                    </LayoutWrapper>
                  } />

                  <Route path="/dashboard" element={
                    <LayoutWrapper>
                      <UserDashboard />
                    </LayoutWrapper>
                  } />

                  {/* <Route path="/delivery" element={
                    <ProtectedRoute allowedRoles={['delivery']}>
                      <DeliveryDashboard />
                    </ProtectedRoute>
                  } /> */}

                  <Route path="/delivery/*" element={
                    <ProtectedRoute allowedRoles={['delivery']}>
                      <DeliveryRoutes />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/*" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminRoutes />
                    </ProtectedRoute>
                  } />

                  {/* 404 Page */}
                  <Route path="*" element={
                    <LayoutWrapper>
                      <NotFound />
                    </LayoutWrapper>
                  } />
                </Routes>
              </Suspense>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
    </div>
  );
}

export default App;