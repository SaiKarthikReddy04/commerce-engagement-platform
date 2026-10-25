import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useAuth } from "../../auth/useAuth.js";
import { useCart } from "../../cart/hooks/useCart.js";
import { useGetProductByIdQuery } from "../api/catalogApi.js";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: price.currency,
  }).format(price.amountInPaise / 100);
}

function getImageUrl(product) {
  const image = product.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;

  const name = product.name?.toLowerCase() ?? "";

  if (name.includes("bottle")) {
    return "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=85";
  }

  if (name.includes("backpack")) {
    return "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85";
  }

  return "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85";
}

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");

  const stockQuantity = Math.max(0, Number(product?.stockQuantity) || 0);

  useEffect(() => {
    setQuantity(1);
    setMessage("");
  }, [productId]);

  async function handleAddToCart() {
    if (!product || stockQuantity < 1) return;

    setIsAdding(true);
    setMessage("");

    try {
      await addItem(product._id ?? product.id, quantity);
      setMessage(
        `Added ${quantity} ${quantity === 1 ? "item" : "items"} to your cart.`,
      );
    } catch (requestError) {
      setMessage(
        requestError.message || "Could not add this product to your cart.",
      );
    } finally {
      setIsAdding(false);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-24 text-slate-600">
        Loading product…
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-24">
        <p role="alert" className="text-red-700">
          {error?.data?.error?.message || "This product could not be found."}
        </p>
        <Link
          to="/"
          className="mt-6 inline-block text-blue-700 hover:underline"
        >
          Return to the collection
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-12 sm:px-12 lg:px-20">
      <Link to="/" className="text-sm text-slate-600 hover:text-blue-700">
        ← Back to collection
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-3xl bg-slate-100">
          <img
            src={getImageUrl(product)}
            alt={product.name}
            className="aspect-square h-full w-full object-cover"
          />
        </div>

        <section className="flex flex-col justify-center py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
            {product.brand || product.category}
          </p>

          <h1 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
            {product.name}
          </h1>

          <p className="mt-5 text-2xl font-semibold">
            {formatPrice(product.price)}
          </p>

          <p className="mt-6 max-w-xl leading-7 text-slate-600">
            {product.description}
          </p>

          <p className="mt-6 text-sm text-slate-600">
            {stockQuantity > 0
              ? `${stockQuantity} available`
              : "Currently out of stock"}
          </p>

          {isAuthenticated ? (
            <div className="mt-8 max-w-sm">
              <label
                htmlFor="product-quantity"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Quantity
              </label>

              <div className="flex w-fit items-center overflow-hidden rounded-full border border-slate-300 bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1 || stockQuantity < 1 || isAdding}
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="h-12 w-12 text-lg text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>

                <output
                  id="product-quantity"
                  aria-live="polite"
                  className="min-w-12 text-center font-medium text-slate-950"
                >
                  {quantity}
                </output>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={
                    quantity >= stockQuantity || stockQuantity < 1 || isAdding
                  }
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(stockQuantity, current + 1),
                    )
                  }
                  className="h-12 w-12 text-lg text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding || stockQuantity < 1}
                className="mt-5 w-full rounded-full bg-[#071a33] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {stockQuantity < 1
                  ? "Out of stock"
                  : isAdding
                    ? "Adding…"
                    : "Add to cart"}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              state={{ from: `/products/${product._id ?? productId}` }}
              className="mt-8 block max-w-sm rounded-full bg-[#071a33] px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              Sign in to add to cart
            </Link>
          )}

          {message && (
            <p role="status" className="mt-3 text-sm text-slate-600">
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
