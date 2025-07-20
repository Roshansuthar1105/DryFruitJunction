// src/routes/AdminRoutes.js
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import Loading from '../components/Loading';
import ProductsPage from '../pages/admin/ProductsPage';

// Lazy load all admin pages
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const UsersPage = lazy(() => import('../pages/admin/UsersPage'));
const OrdersPage = lazy(() => import('../pages/admin/OrdersPage'));
const ContactsPage = lazy(() => import('../pages/admin/ContactsPage'));
const ActivitiesPage = lazy(() => import('../pages/admin/ActivitiesPage'));

export default function AdminRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="products" element={<ProductsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}