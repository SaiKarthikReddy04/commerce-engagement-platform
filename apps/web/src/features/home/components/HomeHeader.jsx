import { useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useAuth } from "../../auth/useAuth.js";
import { useCart } from "../../cart/hooks/useCart.js";

gsap.registerPlugin(useGSAP);

export default function HomeHeader() {
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        headerRef.current,
        { y: -18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out" },
      );
    },
    { scope: headerRef },
  );

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header ref={headerRef} className="home-header">
      <Link to="/" className="home-header-brand" aria-label="Commonform home">
        COMMON<span>FORM</span>
      </Link>

      <nav className="home-header-nav" aria-label="Main navigation">
        <Link className="home-header-link" to="/CatalogPage">
          Shop
        </Link>

        <Link className="home-header-link home-header-cart" to="/cart">
          Cart
          {itemCount > 0 && (
            <span className="home-header-count">{itemCount}</span>
          )}
        </Link>

        {isAuthenticated ? (
          <>
            {user?.role === "ADMIN" && (
              <Link className="home-header-link" to="/admin/products">
                Admin
              </Link>
            )}
            <Link className="home-header-link" to="/orders">
              Orders
            </Link>
            <span className="home-header-greeting">Hi, {user?.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="home-header-link"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link className="home-header-link" to="/login">
              Login
            </Link>
            <Link className="home-header-join" to="/register">
              Join
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
