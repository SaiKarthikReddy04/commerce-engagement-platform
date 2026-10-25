import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../auth/useAuth.js";
import { useCart } from "../cart/hooks/useCart.js";
import {
  useListCategoriesQuery,
  useListProductsQuery,
} from "./api/catalogApi.js";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: price.currency,
  }).format(price.amountInPaise / 100);
}

function getProductImage(product) {
  const image = product.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;

  const name = product.name.toLowerCase();

  if (name.includes("bottle")) {
    return "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85";
  }

  if (name.includes("backpack")) {
    return "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85";
  }

  return "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85";
}

export default function CatalogPage() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [quantities, setQuantities] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [addingProductId, setAddingProductId] = useState(null);
  const [cartFeedback, setCartFeedback] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: categories = [] } = useListCategoriesQuery();

  const {
    data: catalogResult,
    isLoading,
    isFetching,
    error: queryError,
  } = useListProductsQuery({
    search,
    category,
    sort,
    page,
    limit: 12,
  });

  const products = catalogResult?.products ?? [];
  const pagination = catalogResult?.pagination;

  const error = queryError
    ? queryError.data?.error?.message ||
      queryError.error ||
      "Could not load products."
    : "";

    async function handleAddToCart(product, quantity = 1) {
      const productId = product._id ?? product.id;

      setAddingProductId(productId);
      setCartFeedback((current) => ({ ...current, [productId]: "" }));

      try {
        await addItem(productId, quantity);

        setCartFeedback((current) => ({
          ...current,
          [productId]: `Added ${quantity} ${quantity === 1 ? "item" : "items"} to your cart.`,
        }));
      } catch (requestError) {
        setCartFeedback((current) => ({
          ...current,
          [productId]: requestError.message,
        }));
      } finally {
        setAddingProductId(null);
      }
    }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    setPage(1);
  }

  function handleSortChange(event) {
    setSort(event.target.value);
    setPage(1);
  }

  return (
    <>
      <section className="relative isolate min-h-[620px] overflow-hidden bg-[#071a33] sm:min-h-[700px]">
        <img
          src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=85"
          alt="Deep blue ocean waves"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06172c]/90 via-[#06172c]/55 to-[#06172c]/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#06172c]/55 via-transparent to-[#06172c]/10" />

        <div className="mx-auto flex min-h-[620px] max-w-[1440px] items-center px-6 py-20 sm:min-h-[700px] sm:px-12 lg:px-20">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
              Everyday, considered
            </p>

            <h1 className="mt-6 text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl">
              Essentials for
              <br />a life well lived.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/75 sm:text-lg">
              Discover useful, lasting pieces chosen to make the everyday feel a
              little more considered.
            </p>

            <a
              href="#products"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#071a33] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Explore the collection
              <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-7 right-8 hidden items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/70 sm:flex">
          <span className="h-px w-12 bg-white/50" />
          Made for daily rituals
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-20 sm:px-12 sm:py-28 lg:px-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
              The collection
            </p>
            <h2
              id="products"
              className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl"
            >
              Considered essentials
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-600">
            Practical pieces, selected for their quality, usefulness, and
            timeless design.
          </p>
        </div>

        <div className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_220px_220px]">
          <label className="sr-only" htmlFor="product-search">
            Search products
          </label>
          <input
            id="product-search"
            type="search"
            maxLength={100}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search products"
            className="min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
          />

          <label className="sr-only" htmlFor="product-category">
            Filter by category
          </label>
          <select
            id="product-category"
            value={category}
            onChange={handleCategoryChange}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
          >
            <option value="">All categories</option>
            {categories.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="product-sort">
            Sort products
          </label>
          <select
            id="product-sort"
            value={sort}
            onChange={handleSortChange}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>

        <div className="mt-5 flex min-h-6 items-center justify-between text-sm text-slate-500">
          <p>
            {pagination?.total ?? 0}{" "}
            {(pagination?.total ?? 0) === 1 ? "product" : "products"}
          </p>
          {isFetching && !isLoading && <p>Updating collection…</p>}
        </div>

        {isLoading && (
          <p className="py-16 text-sm text-slate-600">
            Loading the collection…
          </p>
        )}

        {error && (
          <p role="alert" className="py-16 text-sm text-red-700">
            Could not load products: {error}
          </p>
        )}

        {!isLoading && !error && products.length === 0 && (
          <p className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
            No products match those filters. Try another search or category.
          </p>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const productId = product._id ?? product.id;

              return (
                <article
                  key={productId}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      {product.brand || product.category}
                    </p>

                    <h3 className="mt-3 text-xl font-medium tracking-tight">
                      {product.name}
                    </h3>

                    <Link
                      to={`/products/${productId}`}
                      className="mt-3 inline-block text-sm font-medium text-blue-700 hover:text-blue-900"
                    >
                      View product →
                    </Link>

                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                      {product.description}
                    </p>

                    <div className="mt-5 ">
                      <div className="mt-7 flex items-end justify-between  border-t border-slate-100 pt-5 mx-6">
                        <p className="text-lg font-semibold items-center mb-5">
                          {formatPrice(product.price)}
                        </p>

                        <div className="mb-4 flex w-fit items-center overflow-hidden rounded-full border border-slate-300 bg-white">
                          <button
                            type="button"
                            aria-label={`Decrease quantity for ${product.name}`}
                            disabled={
                              (quantities[productId] ?? 1) <= 1 ||
                              product.stockQuantity < 1 ||
                              addingProductId === productId
                            }
                            onClick={() =>
                              setQuantities((current) => ({
                                ...current,
                                [productId]: Math.max(
                                  1,
                                  (current[productId] ?? 1) - 1,
                                ),
                              }))
                            }
                            className="h-10 w-10 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          <output
                            aria-live="polite"
                            className="min-w-10 text-center text-sm"
                          >
                            {quantities[productId] ?? 1}
                          </output>

                          <button
                            type="button"
                            aria-label={`Increase quantity for ${product.name}`}
                            disabled={
                              (quantities[productId] ?? 1) >=
                                product.stockQuantity ||
                              addingProductId === productId
                            }
                            onClick={() =>
                              setQuantities((current) => ({
                                ...current,
                                [productId]: Math.min(
                                  product.stockQuantity,
                                  (current[productId] ?? 1) + 1,
                                ),
                              }))
                            }
                            className="h-10 w-10 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-xs text-slate-500 mb-7">
                          {product.stockQuantity} in stock
                        </p>
                      </div>

                      {isAuthenticated ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleAddToCart(product, quantities[productId] ?? 1)
                          }
                          disabled={
                            addingProductId === productId ||
                            product.stockQuantity < 1
                          }
                          className="w-full rounded-full bg-[#071a33] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {product.stockQuantity < 1
                            ? "Out of stock"
                            : addingProductId === productId
                              ? "Adding…"
                              : "Add to cart"}
                        </button>
                      ) : (
                        <Link
                          to="/login"
                          state={{ from: `/products/${productId}` }}
                          className="block rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-800 transition hover:border-[#071a33] hover:bg-slate-50"
                        >
                          Sign in to add to cart
                        </Link>
                      )}

                      {cartFeedback[productId] && (
                        <p
                          role="status"
                          className="mt-3 text-sm text-slate-600"
                        >
                          {cartFeedback[productId]}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {pagination?.pages > 1 && (
          <nav
            aria-label="Product pages"
            className="mt-10 flex items-center justify-center gap-5"
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-slate-600">
              Page {pagination.page} of {pagination.pages}
            </span>

            <button
              type="button"
              disabled={page >= pagination.pages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </>
  );
}
