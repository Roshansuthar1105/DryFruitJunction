// src/routes/AdminRoutes.js
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import DeliveryLayout from '../components/delivery/DeliveryLayout';
import Loading from '../components/Loading';

// Lazy load all admin pages
const DeliveryOrdersPage = lazy(() => import('../pages/delivery/DeliveryOrdersPage'));


export default function AdminRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<DeliveryLayout />}>
          <Route index element={<DeliveryOrdersPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}