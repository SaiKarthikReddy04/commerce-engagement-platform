import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useCreateAdminProductMutation } from "../api/adminProductsApi.js";

const initialForm = {
  sku: "",
  name: "",
  description: "",
  category: "",
  brand: "",
  priceRupees: "",
  stockQuantity: "0",
  status: "DRAFT",
  imageUrl: "",
  imageAltText: "",
};

function getErrorMessage(error) {
  return (
    error?.data?.error?.message ||
    error?.error ||
    "Could not create the product."
  );
}

export default function AdminCreateProductPage() {
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state) => state.auth);
  const [createProduct, { isLoading }] = useCreateAdminProductMutation();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!/^\d+(\.\d{1,2})?$/.test(form.priceRupees)) {
      setError("Enter a valid price with no more than two decimal places.");
      return;
    }

    const amountInPaise = Math.round(Number(form.priceRupees) * 100);
    const stockQuantity = Number(form.stockQuantity);

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise < 0) {
      setError("Enter a valid non-negative price.");
      return;
    }

    if (!Number.isSafeInteger(stockQuantity) || stockQuantity < 0) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    const product = {
      sku: form.sku,
      name: form.name,
      description: form.description,
      category: form.category,
      brand: form.brand,
      price: {
        amountInPaise,
        currency: "INR",
      },
      stockQuantity,
      status: form.status,
      images: form.imageUrl.trim()
        ? [
            {
              url: form.imageUrl.trim(),
              altText: form.imageAltText.trim(),
            },
          ]
        : [],
    };

    try {
      await createProduct(product).unwrap();
      navigate("/admin/products");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  if (!accessToken || user?.role !== "ADMIN") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-medium">Admin access required</h1>
        <p className="mt-3 text-slate-600">
          Sign in with an admin account to create products.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block text-blue-700 hover:underline"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-14 sm:px-10">
      <Link
        to="/admin/products"
        className="text-sm text-slate-600 hover:text-blue-700"
      >
        ← Back to products
      </Link>

      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
        Store management
      </p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">
        Create product
      </h1>
      <p className="mt-3 text-slate-600">
        Add a product to your store catalog.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
      >
        <div>
          <label htmlFor="sku" className="mb-2 block text-sm font-medium">
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            required
            maxLength={64}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
          />
        </div>

        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Product name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={160}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            maxLength={4000}
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium"
            >
              Category
            </label>
            <input
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
            />
          </div>

          <div>
            <label htmlFor="brand" className="mb-2 block text-sm font-medium">
              Brand
            </label>
            <input
              id="brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              maxLength={100}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label
              htmlFor="priceRupees"
              className="mb-2 block text-sm font-medium"
            >
              Price (₹)
            </label>
            <input
              id="priceRupees"
              name="priceRupees"
              type="number"
              min="0"
              step="0.01"
              value={form.priceRupees}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
            />
          </div>

          <div>
            <label
              htmlFor="stockQuantity"
              className="mb-2 block text-sm font-medium"
            >
              Stock quantity
            </label>
            <input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="0"
              step="1"
              value={form.stockQuantity}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
            />
          </div>

          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium">
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
          />
        </div>

        {form.imageUrl && (
          <div>
            <label
              htmlFor="imageAltText"
              className="mb-2 block text-sm font-medium"
            >
              Image description (optional)
            </label>
            <input
              id="imageAltText"
              name="imageAltText"
              value={form.imageAltText}
              onChange={handleChange}
              maxLength={200}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
            />
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-[#071a33] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating product…" : "Create product"}
        </button>
      </form>
    </main>
  );
}
