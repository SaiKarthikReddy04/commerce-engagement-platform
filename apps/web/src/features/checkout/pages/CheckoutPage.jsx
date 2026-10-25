import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../auth/useAuth.js";
import { useGetCartQuery } from "../../cart/api/cartApi.js";
import { useCreateOrderMutation } from "../../orders/api/ordersApi.js";

function formatPrice(amountInPaise, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amountInPaise / 100);
}

function readActiveOrganization() {
  try {
    const saved = localStorage.getItem("activeOrganization");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function CheckoutPage() {
  const [activeOrganization] = useState(readActiveOrganization);
  const [checkoutForOrganization, setCheckoutForOrganization] = useState(false);

  const { isAuthenticated } = useAuth();

  const {
    data: cart,
    isLoading: isCartLoading,
    error: cartError,
  } = useGetCartQuery(undefined, { skip: !isAuthenticated });

  const [createOrder, { isLoading: isPlacingOrder, error: orderError }] =
    useCreateOrderMutation();

  const [placedOrder, setPlacedOrder] = useState(null);

async function handlePlaceOrder() {
  try {
    const body =
      checkoutForOrganization && activeOrganization?._id
        ? { organizationId: activeOrganization._id }
        : {};

    const order = await createOrder(body).unwrap();
    setPlacedOrder(order?.data ?? order);
  } catch {
    // RTK Query exposes the request error through orderError.
  }
  }
  

  const errorMessage =
    orderError?.data?.error?.message ||
    orderError?.error ||
    cartError?.data?.error?.message ||
    cartError?.error ||
    "";

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
          Checkout
        </p>
        <h1 className="mt-4 text-4xl font-medium">Sign in to continue</h1>
        <p className="mt-4 text-slate-600">
          Sign in to place an order from your cart.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex rounded-full bg-[#071a33] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900"
        >
          Sign in
        </Link>
      </main>
    );
  }

  if (placedOrder) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
          Order placed
        </p>
        <h1 className="mt-4 text-4xl font-medium">Thank you for your order.</h1>
        <p className="mt-4 text-slate-600">
          Order reference:{" "}
          <span className="font-medium text-slate-900">{placedOrder._id}</span>
        </p>
        <p className="mt-2 text-slate-600">
          Current status:{" "}
          <span className="font-medium text-slate-900">
            {placedOrder.status}
          </span>
        </p>
        <Link
          to="/orders"
          className="mt-8 inline-flex rounded-full bg-[#071a33] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900"
        >
          View orders
        </Link>
      </main>
    );
  }

  if (isCartLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-24 text-slate-600">
        Loading checkout…
      </main>
    );
  }

  if (cartError) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p role="alert" className="text-red-700">
          {cartError.data?.error?.message ||
            cartError.error ||
            "Could not load your cart."}
        </p>
        <Link
          to="/cart"
          className="mt-6 inline-flex rounded-full bg-[#071a33] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900"
        >
          Return to cart
        </Link>
      </main>
    );
  }
  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-medium">Your cart is empty</h1>
        <p className="mt-3 text-slate-600">
          Add a product before continuing to checkout.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-[#071a33] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900"
        >
          Return to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
        Final step
      </p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">Review order</h1>
      <p className="mt-3 text-slate-600">
        Check your items before placing the order.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <section className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6">
          {items.map((item) => (
            <div
              key={item.product.id ?? item.product._id}
              className="flex items-center justify-between gap-5 py-5"
            >
              <div>
                <h2 className="font-medium">{item.product.name}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="shrink-0 font-medium">
                {formatPrice(item.lineTotalInPaise)}
              </p>
            </div>
          ))}
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          {activeOrganization ? (
            <label className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={checkoutForOrganization}
                onChange={(event) =>
                  setCheckoutForOrganization(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-blue-800"
              />
              <span>
                <span className="block text-sm font-medium">
                  Purchase for {activeOrganization.name}
                </span>
                <span className="mt-1 block text-sm text-slate-600">
                  {activeOrganization.requiresApproval
                    ? "This order will wait for organization approval."
                    : "This order will be placed under your organization."}
                </span>
              </span>
            </label>
          ) : (
            <Link
              to="/business"
              className="mt-6 block text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              Set up an organization for business purchasing
            </Link>
          )}
          <h2 className="text-lg font-medium">Order summary</h2>
          <div className="mt-6 flex justify-between border-t border-slate-200 pt-5">
            <span className="text-sm text-slate-600">Subtotal</span>
            <span className="font-semibold">
              {formatPrice(
                cart?.subtotal?.amountInPaise ?? 0,
                cart?.subtotal?.currency ?? "INR",
              )}
            </span>
          </div>

          {errorMessage && (
            <p role="alert" className="mt-5 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="mt-7 w-full rounded-full bg-[#071a33] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPlacingOrder ? "Placing order…" : "Place order"}
          </button>

          <Link
            to="/cart"
            className="mt-4 block text-center text-sm text-slate-600 hover:text-blue-700"
          >
            Return to cart
          </Link>
        </aside>
      </div>
    </main>
  );
}
