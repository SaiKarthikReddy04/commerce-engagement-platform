import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import {
  useListAdminProductsQuery,
  useUpdateAdminProductMutation,
  useDeleteAdminProductMutation,
} from "../api/adminProductsApi.js";
import AdminEditProductDialog from "../components/AdminEditProductDialog.jsx";
import { showToast } from "../../../lib/toast.js";
import Spinner from "../../../components/ui/Spinner.jsx";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: price.currency,
  }).format(price.amountInPaise / 100);
}

function getErrorMessage(error) {
  return (
    error?.data?.error?.message ||
    error?.error ||
    "Could not load admin products."
  );
}

function statusStyle(status) {
  if (status === "ACTIVE") return "bg-emerald-50 text-emerald-800";
  if (status === "ARCHIVED") return "bg-slate-100 text-slate-600";
  return "bg-amber-50 text-amber-800";
}

export default function AdminProductsPage() {
  const { user, accessToken } = useSelector((state) => state.auth);
  const isAdmin = Boolean(accessToken && user?.role === "ADMIN");

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionError, setActionError] = useState("");

  const [updateAdminProduct, { isLoading: isUpdating }] =
    useUpdateAdminProductMutation();
  const [
    deleteAdminProduct,
    { isLoading: isDeleting, isSuccess: isDeleteSuccess },
  ] = useDeleteAdminProductMutation();

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: refetchAdminProducts,
  } = useListAdminProductsQuery(
    {
      page,
      limit: 20,
      status: status || undefined,
    },
    { skip: !isAdmin },
  );

  useEffect(() => {
    if (isDeleteSuccess) {
      refetchAdminProducts();
    }
  }, [isDeleteSuccess, refetchAdminProducts]);

  async function handleSaveEdit(updates) {
    setActionError("");

    try {
      await updateAdminProduct({
        productId: editingProduct._id,
        updates,
      }).unwrap();

      setEditingProduct(null);
    } catch (requestError) {
      setActionError(
        requestError?.data?.error?.message ||
          requestError?.error ||
          "Could not save product changes.",
      );
    }
  }

  async function handleMoveToDraft(product) {
    const confirmed = window.confirm(
      `Move "${product.name}" to draft? It will no longer appear in the storefront.`,
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await updateAdminProduct({
        productId: product._id,
        updates: { status: "DRAFT" },
      }).unwrap();
    } catch (requestError) {
      setActionError(
        requestError?.data?.error?.message ||
          requestError?.error ||
          "Could not move the product to draft.",
      );
    }
  }

  async function handleMoveToActive(product) {
    const confirmed = window.confirm(
      `Move "${product.name}" to active? It will appear in the storefront.`,
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await updateAdminProduct({
        productId: product._id,
        updates: { status: "ACTIVE" },
      }).unwrap();
    } catch (requestError) {
      setActionError(
        requestError?.data?.error?.message ||
          requestError?.error ||
          "Could not move the product to draft.",
      );
    }
  }

  async function handleDeleteDraft(product) {
    const confirmed = window.confirm(
      `Permanently delete draft "${product.name}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await deleteAdminProduct(product._id).unwrap();
      showToast("Product deleted.", "success");
    } catch (requestError) {
      showToast(
        requestError?.data?.error?.message ||
          requestError?.error ||
          "Could not delete the draft product.",
        "failure",
      );
    }
  }

  if (!accessToken) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-medium">Sign in to continue</h1>
        <p className="mt-3 text-slate-600">
          Admin access is required to manage products.
        </p>
        <Link
          to="/login"
          className="mt-7 inline-flex rounded-full bg-[#071a33] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900"
        >
          Sign in
        </Link>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-medium">Admin access required</h1>
        <p className="mt-3 text-slate-600">
          Your account doesn’t have permission to manage products.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block text-blue-700 hover:underline"
        >
          Return to shop
        </Link>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-7xl justify-center px-6 py-24">
        <Spinner size="lg" label="Loading products…" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-24">
        <p role="alert" className="text-red-700">
          {getErrorMessage(error)}
        </p>
      </main>
    );
  }

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  // console.log("products data:", products[0].images[0].url);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
        Store management
      </p>

      <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-medium tracking-tight">Products</h1>
          <p className="mt-3 text-slate-600">
            Manage the products available in your store.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm text-slate-600">
            Status
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="ml-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800"
            >
              <option value="">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>

          <Link
            to="/admin/products/new"
            className="rounded-full bg-[#071a33] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900"
          >
            Add product
          </Link>
        </div>
      </div>

      {actionError && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {actionError}
        </p>
      )}

      {isFetching && !isLoading && (
        <div className="mt-5 flex justify-center">
          <Spinner size="sm" label="Updating products…" />
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[840px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">Img</th>
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">SKU</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Stock</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const firstImage = product.images?.[0];
              const imageUrl =
                typeof firstImage === "string" ? firstImage : firstImage?.url;

              return (
                <tr key={product._id} className="text-slate-700">
                  <td className="px-5 py-4 font-medium text-slate-950">
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
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-950">
                    {product.name}
                  </td>
                  <td className="px-5 py-4">{product.sku}</td>
                  <td className="px-5 py-4">{product.category}</td>
                  <td className="px-5 py-4">{formatPrice(product.price)}</td>
                  <td className="px-5 py-4">{product.stockQuantity}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(product.status)}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setActionError("");
                          setEditingProduct(product);
                        }}
                        className="font-medium text-blue-700 hover:text-blue-900"
                      >
                        Edit
                      </button>

                      {product.status !== "DRAFT" && (
                        <button
                          type="button"
                          onClick={() => handleMoveToDraft(product)}
                          disabled={isUpdating}
                          className="font-medium text-amber-700 hover:text-amber-900 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer "
                        >
                          Draft
                        </button>
                      )}

                      {product.status === "DRAFT" && (
                        <button
                          type="button"
                          onClick={() => handleMoveToActive(product)}
                          disabled={isUpdating}
                          className="font-medium text-green-700 hover:text-green-900 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer"
                        >
                          Active
                        </button>
                      )}

                      {
                        <button
                          type="button"
                          onClick={() => handleDeleteDraft(product)}
                          disabled={isDeleting}
                          className="font-medium text-red-700 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer"
                        >
                          Delete
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              );
            })}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-slate-500"
                >
                  No products match this status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination?.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm disabled:opacity-40"
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
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {editingProduct && (
        <AdminEditProductDialog
          product={editingProduct}
          isSaving={isUpdating}
          error={actionError}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveEdit}
        />
      )}
    </main>
  );
}
