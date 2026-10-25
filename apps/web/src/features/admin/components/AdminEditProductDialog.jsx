import { useState } from "react";

function getInitialForm(product) {
  const image = product.images?.[0];

  return {
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand || "",
    priceRupees: (product.price.amountInPaise / 100).toFixed(2),
    stockQuantity: String(product.stockQuantity),
    status: product.status,
    imageUrl: typeof image === "string" ? image : image?.url || "",
    imageAltText: image?.altText || "",
  };
}

export default function AdminEditProductDialog({
  product,
  isSaving,
  error,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(() => getInitialForm(product));
  const [formError, setFormError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!/^\d+(\.\d{1,2})?$/.test(form.priceRupees)) {
      setFormError("Enter a price with no more than two decimal places.");
      return;
    }

    const amountInPaise = Math.round(Number(form.priceRupees) * 100);
    const stockQuantity = Number(form.stockQuantity);

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise < 0) {
      setFormError("Enter a valid non-negative price.");
      return;
    }

    if (!Number.isSafeInteger(stockQuantity) || stockQuantity < 0) {
      setFormError("Stock must be a non-negative whole number.");
      return;
    }

    onSave({
      name: form.name,
      description: form.description,
      category: form.category,
      brand: form.brand,
      price: { amountInPaise, currency: "INR" },
      stockQuantity,
      status: form.status,
      images: form.imageUrl.trim()
        ? [{ url: form.imageUrl.trim(), altText: form.imageAltText.trim() }]
        : [],
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-title"
        className="my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          Store management
        </p>
        <h2
          id="edit-product-title"
          className="mt-2 text-2xl font-medium tracking-tight"
        >
          Edit product
        </h2>
        <p className="mt-2 text-sm text-slate-500">SKU: {product.sku}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="edit-name"
              className="mb-1.5 block text-sm font-medium"
            >
              Product name
            </label>
            <input
              id="edit-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={160}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="mb-1.5 block text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              maxLength={4000}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-category"
                className="mb-1.5 block text-sm font-medium"
              >
                Category
              </label>
              <input
                id="edit-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="edit-brand"
                className="mb-1.5 block text-sm font-medium"
              >
                Brand
              </label>
              <input
                id="edit-brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                maxLength={100}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="edit-price"
                className="mb-1.5 block text-sm font-medium"
              >
                Price (₹)
              </label>
              <input
                id="edit-price"
                name="priceRupees"
                type="number"
                min="0"
                step="0.01"
                value={form.priceRupees}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="edit-stock"
                className="mb-1.5 block text-sm font-medium"
              >
                Stock quantity
              </label>
              <input
                id="edit-stock"
                name="stockQuantity"
                type="number"
                min="0"
                step="1"
                value={form.stockQuantity}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="edit-status"
                className="mb-1.5 block text-sm font-medium"
              >
                Status
              </label>
              <select
                id="edit-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-image-url"
                className="mb-1.5 block text-sm font-medium"
              >
                Image URL
              </label>
              <input
                id="edit-image-url"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
          </div>

          {form.imageUrl && (
            <div>
              <label
                htmlFor="edit-image-alt"
                className="mb-1.5 block text-sm font-medium"
              >
                Image description
              </label>
              <input
                id="edit-image-alt"
                name="imageAltText"
                value={form.imageAltText}
                onChange={handleChange}
                maxLength={200}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
          )}

          {(formError || error) && (
            <p role="alert" className="text-sm text-red-700">
              {formError || error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-[#071a33] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
