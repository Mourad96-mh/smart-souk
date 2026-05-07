import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCategoryForm from './pages/admin/AdminCategoryForm';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';

import { useState } from 'react';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Routes>
        {/* Public routes with Navbar */}
        <Route
          path="/"
          element={
            <div className="page-wrapper">
              <Navbar onCartOpen={() => setCartOpen(true)} />
              <Home />
              <Footer />
              <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            </div>
          }
        />
        <Route
          path="/produits"
          element={
            <div className="page-wrapper">
              <Navbar onCartOpen={() => setCartOpen(true)} />
              <Products />
              <Footer />
              <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            </div>
          }
        />
        <Route
          path="/produits/:id"
          element={
            <div className="page-wrapper">
              <Navbar onCartOpen={() => setCartOpen(true)} />
              <ProductDetail />
              <Footer />
              <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            </div>
          }
        />
        <Route
          path="/checkout"
          element={
            <div className="page-wrapper">
              <Navbar onCartOpen={() => setCartOpen(true)} />
              <Checkout />
              <Footer />
            </div>
          }
        />

        <Route
          path="/contact"
          element={
            <div className="page-wrapper">
              <Navbar onCartOpen={() => setCartOpen(true)} />
              <Contact />
              <Footer />
              <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            </div>
          }
        />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={<PrivateRoute><AdminCategories /></PrivateRoute>}
        />
        <Route
          path="/admin/categories/nouvelle"
          element={<PrivateRoute><AdminCategoryForm /></PrivateRoute>}
        />
        <Route
          path="/admin/categories/:id/modifier"
          element={<PrivateRoute><AdminCategoryForm /></PrivateRoute>}
        />
        <Route
          path="/admin/produits"
          element={
            <PrivateRoute>
              <AdminProducts />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/produits/nouveau"
          element={
            <PrivateRoute>
              <AdminProductForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/produits/:id/modifier"
          element={
            <PrivateRoute>
              <AdminProductForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/commandes"
          element={
            <PrivateRoute>
              <AdminOrders />
            </PrivateRoute>
          }
        />
        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="page-wrapper">
              <Navbar onCartOpen={() => setCartOpen(true)} />
              <NotFound />
              <Footer />
            </div>
          }
        />
      </Routes>
    </>
  );
}
