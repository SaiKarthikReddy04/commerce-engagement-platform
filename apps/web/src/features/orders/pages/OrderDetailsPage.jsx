import { Link, useParams } from "react-router";
import { useAuth } from "../../auth/useAuth.js";
import { useGetOrderByIdQuery } from "../api/ordersApi.js";

function formatPrice(amountInPaise, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amountInPaise / 100);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function getErrorMessage(error) {
  return (
    error?.data?.error?.message || error?.error || "Could not load this order."
  );
}

function statusStyle(status) {
  if (status === "CONFIRMED") return "bg-emerald-50 text-emerald-800";
  if (status === "CANCELLED") return "bg-red-50 text-red-700";
  if (status === "PENDING_APPROVAL") return "bg-blue-50 text-blue-800";
  return "bg-amber-50 text-amber-800";
}

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();

  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderByIdQuery(orderId, {
    skip: !isAuthenticated || !orderId,
  });

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-medium">Sign in to view this order</h1>
        <Link
          to="/login"
          state={{ from: `/orders/${orderId}` }}
          className="mt-7 inline-flex rounded-full bg-[#071a33] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900"
        >
          Sign in
        </Link>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-24 text-slate-600">
        Loading order…
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24">
        <p role="alert" className="text-red-700">
          {getErrorMessage(error)}
        </p>
        <Link
          to="/orders"
          className="mt-6 inline-flex text-blue-700 hover:underline"
        >
          Back to order history
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:px-10 lg:px-16">
      <Link to="/orders" className="text-sm text-slate-600 hover:text-blue-700">
        ← Back to order history
      </Link>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
            Order details
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight">
            #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-xs font-semibold ${statusStyle(order.status)}`}
        >
          {order.status.replaceAll("_", " ")}
        </span>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-medium">Items</h2>

        <ul className="mt-5 divide-y divide-slate-100">
          {order.items.map((item) => (
            <li
              key={`${order._id}-${item.productId}`}
              className="flex flex-wrap items-center justify-between gap-4 py-5"
            >
              <div>
                <p className="font-medium text-slate-950">{item.name}</p>
                <p className="mt-1 text-sm text-slate-600">
                  SKU {item.sku} · Quantity {item.quantity}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Unit price:{" "}
                  {formatPrice(item.unitPriceInPaise, order.currency)}
                </p>
              </div>

              <p className="font-medium text-slate-950">
                {formatPrice(item.lineTotalInPaise, order.currency)}
              </p>
            </li>
          ))}
        </ul>

        <div className="flex justify-between border-t border-slate-200 pt-5">
          <span className="font-medium">Order total</span>
          <span className="font-semibold">
            {formatPrice(order.subtotalInPaise, order.currency)}
          </span>
        </div>
      </section>

      {order.organizationId && (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-medium">Organization approval</h2>
          <p className="mt-2 text-sm text-slate-600">
            Organization order · {order.approvalDecision || order.status}
          </p>
          {order.reviewedAt && (
            <p className="mt-1 text-sm text-slate-600">
              Reviewed {formatDate(order.reviewedAt)}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
