import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../auth/useAuth.js";
import { useCart } from "../hooks/useCart.js";


function formatPrice(amountInPaise, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amountInPaise / 100);
}

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const {
    cart,
    refreshCart,
    updateItem,
    removeItem: removeCartItem,
  } = useCart();

  const [isLoading, setIsLoading] = useState(true);
  const [busyProductId, setBusyProductId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    refreshCart()
      .catch((requestError) => {
        if (!ignore) setError(requestError.message);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, refreshCart]);

  async function changeQuantity(productId, quantity) {
    setError("");
    setBusyProductId(productId);

    try {
      await updateItem(productId, quantity);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyProductId(null);
    }
  }

  async function handleRemove(productId) {
    setError("");
    setBusyProductId(productId);

    try {
      await removeCartItem(productId);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyProductId(null);
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
          Your bag
        </p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight">
          Sign in to see your cart
        </h1>
        <p className="mt-4 text-slate-600">
          Your cart is saved to your account.
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

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-24 text-slate-600">
        Loading your cart…
      </main>
    );
  }

  const items = cart?.items ?? [];

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
        Your bag
      </p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">Cart</h1>
      <p className="mt-3 text-sm text-slate-600">
        {items.length} {items.length === 1 ? "product" : "products"} in your bag
      </p>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <h2 className="text-2xl font-medium">Your cart is empty</h2>
          <p className="mt-3 text-slate-600">
            Find something useful for your everyday.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex rounded-full bg-[#071a33] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900"
          >
            Explore the collection
          </Link>
        </section>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          <section className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 sm:px-7">
            {items.map((item) => {
              const product = item.product;
              const productId = product?.id ?? product?._id;
              const isBusy = busyProductId === productId;

              if (!productId) return null;
              const firstImage = product.images?.[0];
              const imageUrl =
                typeof firstImage === "string" ? firstImage : firstImage?.url;
          
              return (
                <article
                  key={productId}
                  className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center"
                >
                  <div className="grid h-28 w-full shrink-0 place-items-center rounded-xl bg-[#eef2f7] text-xs uppercase tracking-widest text-slate-500 sm:w-32">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        aria-label="No product image"
                        className="h-16 w-16 rounded-lg bg-slate-200"
                      />
                    )}
                    
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {product.brand || product.category}
                    </p>
                    <h2 className="mt-2 text-lg font-medium">{product.name}</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {formatPrice(
                        product.price.amountInPaise,
                        product.price.currency,
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
                    <div className="flex items-center rounded-full border border-slate-300">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${product.name}`}
                        disabled={isBusy || item.quantity <= 1}
                        onClick={() =>
                          changeQuantity(productId, item.quantity - 1)
                        }
                        className="px-3 py-2 text-slate-700 disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm">
                        {isBusy ? "…" : item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${product.name}`}
                        disabled={
                          isBusy || item.quantity >= product.stockQuantity
                        }
                        onClick={() =>
                          changeQuantity(productId, item.quantity + 1)
                        }
                        className="px-3 py-2 text-slate-700 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-semibold">
                      {formatPrice(item.lineTotalInPaise)}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleRemove(productId)}
                    className="text-left text-sm text-slate-500 underline underline-offset-4 hover:text-red-700 disabled:opacity-50 sm:self-end"
                  >
                    Remove
                  </button>
                </article>
              );
            })}
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
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

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Shipping and final details will be shown at checkout.
            </p>

            <Link
              to="/checkout"
              className="mt-7 block rounded-full bg-[#071a33] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-900"
            >
              Continue to checkout
            </Link>
                          
            <Link
              to="/"
              className="mt-7 block rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
