import { Link, Route, Routes, useNavigate } from "react-router";
import { useAuth } from "./features/auth/useAuth.js";
import CatalogPage from "./features/catalog/CatalogPage.jsx";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import RegisterPage from "./features/auth/pages/RegisterPage.jsx";
import { useCart } from "./features/cart/hooks/useCart.js";
import CartPage from "./features/cart/pages/CartPage.jsx";
import CheckoutPage from "./features/checkout/pages/CheckoutPage.jsx";
import OrdersPage from "./features/orders/pages/OrdersPage.jsx";
import ProductDetailsPage from "./features/catalog/pages/ProductDetailsPage.jsx";
import AdminProductsPage from "./features/admin/pages/AdminProductsPage.jsx";
import AdminCreateProductPage from "./features/admin/pages/AdminCreateProductPage.jsx";
import BusinessPortalPage from "./features/business-portal/pages/BusinessPortalPage.jsx";
import OrderDetailsPage from "./features/orders/pages/OrderDetailsPage.jsx";

function Placeholder({ title }) {

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
        Commerce platform
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
        {title}
      </h1>
      <p className="mt-3 text-slate-600">This page is coming next.</p>
    </section>
  );
}

export default function App() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-950">
      <div className="bg-[#071a33] px-4 py-2 text-center text-xs tracking-wide text-white/80">
        Thoughtful essentials. Made for everyday life.
      </div>

      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            to="/"
            className="shrink-0 text-lg font-semibold tracking-tight"
          >
            COMMON<span className="text-blue-700">FORM</span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex items-center gap-4 text-sm sm:gap-8"
          >
            <Link
              className="text-slate-700 transition hover:text-blue-700"
              to="/"
            >
              Shop
            </Link>

            <Link
              className="flex items-center gap-2 text-slate-700 transition hover:text-blue-700"
              to="/cart"
            >
              Cart
              {itemCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#071a33] px-1.5 text-xs text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {user?.role === "ADMIN" && (
              <Link
                to="/admin/products"
                className="text-slate-700 hover:text-blue-700"
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <span className="hidden text-slate-500 md:block">
                  Hi, {user?.name}
                </span>
                <Link
                  className="hidden text-slate-700 transition hover:text-blue-700 sm:block"
                  to="/orders"
                >
                  Orders
                </Link>
                <Link
                  className="text-slate-700 transition hover:text-blue-700"
                  to="/business"
                >
                  Business
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="font-medium text-slate-700 transition hover:text-blue-700"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  className="text-slate-700 transition hover:text-blue-700"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="hidden rounded-full bg-[#071a33] px-4 py-2 font-medium text-white transition hover:bg-blue-900 sm:block"
                  to="/register"
                >
                  Join
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/products/:productId" element={<ProductDetailsPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route
          path="/admin/products/new"
          element={<AdminCreateProductPage />}
        />
        <Route path="/business" element={<BusinessPortalPage />} />
        <Route path="*" element={<Placeholder title="Page not found" />} />
        <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
      </Routes>
    </div>
  );
}