import { useState } from "react";
import {
  useGetPendingOrganizationOrdersQuery,
  useReviewOrganizationOrderMutation,
} from "../api/businessPortalApi.js";

function formatPrice(amountInPaise, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amountInPaise / 100);
}

function formatDate(value) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
      }).format(date);
}

export default function PendingOrganizationOrdersPanel({ organizationId }) {
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState("");

  const {
    data,
    isLoading,
    error: queryError,
  } = useGetPendingOrganizationOrdersQuery(
    { organizationId, page, limit: 10 },
    { skip: !organizationId },
  );

  const [reviewOrder, { isLoading: isReviewing, error: reviewError }] =
    useReviewOrganizationOrderMutation();

  const orders = data?.orders ?? [];
  const pagination = data?.pagination;

  async function handleReview(order, decision) {
    const verb = decision === "APPROVED" ? "approve" : "reject";
    const confirmed = window.confirm(
      `Are you sure you want to ${verb} order ${order._id}?`,
    );

    if (!confirmed) return;

    setFeedback("");

    try {
      await reviewOrder({
        organizationId,
        orderId: order._id,
        decision,
      }).unwrap();

      setFeedback(
        decision === "APPROVED"
          ? "Order approved. It can now proceed to payment."
          : "Order rejected and cancelled.",
      );
    } catch {
      // The API error is displayed below.
    }
  }

  const errorMessage =
    reviewError?.data?.error?.message ||
    reviewError?.error ||
    queryError?.data?.error?.message ||
    queryError?.error ||
    "";

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
        Order approvals
      </p>
      <h2 className="mt-3 text-2xl font-medium">Pending orders</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Review organization orders before they proceed to payment.
      </p>

      {errorMessage && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      {feedback && (
        <p role="status" className="mt-5 text-sm text-emerald-700">
          {feedback}
        </p>
      )}

      {isLoading ? (
        <p className="mt-6 text-sm text-slate-500">Loading pending orders…</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
          There are no orders waiting for approval.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const member =
              order.userId && typeof order.userId === "object"
                ? order.userId
                : null;

            return (
              <article
                key={order._id}
                className="rounded-2xl border border-slate-200 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Order
                    </p>
                    <p className="mt-1 font-semibold text-slate-950">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Placed {formatDate(order.createdAt)}
                    </p>
                    {member && (
                      <p className="mt-2 text-sm text-slate-600">
                        Requested by {member.name || member.email}
                      </p>
                    )}
                  </div>

                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                    Pending approval
                  </span>
                </div>

                <div className="mt-5 divide-y divide-slate-100 border-y border-slate-100">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex flex-wrap justify-between gap-3 py-3 text-sm"
                    >
                      <span className="text-slate-700">
                        {item.name}{" "}
                        <span className="text-slate-500">
                          × {item.quantity}
                        </span>
                      </span>
                      <span className="font-medium text-slate-900">
                        {formatPrice(item.lineTotalInPaise, order.currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-slate-600">
                    Order total{" "}
                    <span className="ml-2 font-semibold text-slate-950">
                      {formatPrice(order.subtotalInPaise, order.currency)}
                    </span>
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => handleReview(order, "REJECTED")}
                      className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => handleReview(order, "APPROVED")}
                      className="rounded-full bg-[#071a33] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <p className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.pages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pagination.pages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
