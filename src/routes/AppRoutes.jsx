import { Routes, Route } from "react-router-dom";

/* Public Pages */
import Home from "../pages/public/Home";
import ProductDetails from "../pages/public/ProductDetails";
import Category from "../pages/public/Category";
import NotFound from "../pages/public/NotFound";
// ✅ IMPORT THE NEW PUBLIC CATEGORY BROWSE PAGE
import PublicCategories from "../pages/public/Categories"; 
import About from "../pages/public/About";

/* Admin Pages */
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
// ✅ YOUR EXISTING ADMIN PAGE
import AdminCategories from "../pages/admin/Categories"; 

/* Auth */
import ProtectedRoute from "../components/auth/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/categories" element={<PublicCategories />} /> {/* New Route */}
      <Route path="/about" element={<About />} />

      {/* ADMIN */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/admin/products/new" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
      <Route path="/admin/products/edit/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} /> {/* Existing Route */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;