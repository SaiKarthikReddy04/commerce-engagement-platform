import { useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useListOrdersQuery } from "../api/ordersApi.js";
import { useSimulatePaymentMutation } from "../../payments/api/paymentsApi.js";

function formatPrice(amountInPaise, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amountInPaise / 100);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function getErrorMessage(error, fallback) {
  return error?.data?.error?.message || error?.error || fallback;
}

function statusStyle(status) {
  if (status === "CONFIRMED") return "bg-emerald-50 text-emerald-800";
  if (status === "CANCELLED") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-800";
}

export default function OrdersPage() {
  const isAuthenticated = useSelector((state) =>
    Boolean(state.auth.user && state.auth.accessToken),
  );

  const { data, isLoading, error } = useListOrdersQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [simulatePayment, { isLoading: isSimulating }] =
    useSimulatePaymentMutation();
  const [simulatingOrderId, setSimulatingOrderId] = useState(null);
  const [paymentError, setPaymentError] = useState("");

  async function handleSimulatePayment(orderId, outcome) {
    setPaymentError("");
    setSimulatingOrderId(orderId);

    try {
      await simulatePayment({ orderId, outcome }).unwrap();
    } catch (requestError) {
      setPaymentError(
        getErrorMessage(requestError, "Could not process the demo payment."),
      );
    } finally {
      setSimulatingOrderId(null);
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl font-medium">Sign in to view your orders</h1>
        <p className="mt-4 text-slate-600">
          Your order history is connected to your account.
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
        Loading your orders…
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-24">
        <p role="alert" className="text-red-700">
          {getErrorMessage(error, "Could not load your orders.")}
        </p>
      </main>
    );
  }

  const orders = data?.orders ?? [];

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
        Your account
      </p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">
        Order history
      </h1>
      <p className="mt-3 text-slate-600">
        Review the orders you’ve placed with us.
      </p>

      {paymentError && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {paymentError}
        </p>
      )}

      {orders.length === 0 ? (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <h2 className="text-2xl font-medium">No orders yet</h2>
          <p className="mt-3 text-slate-600">
            Your placed orders will appear here.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex rounded-full bg-[#071a33] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900"
          >
            Explore the collection
          </Link>
        </section>
      ) : (
        <div className="mt-10 space-y-5">
          {orders.map((order) => (
            <article
              key={order._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Order reference
                  </p>
                  <Link
                    to={`/orders/${order._id}`}
                    className="mt-2 inline-block font-semibold text-slate-950 hover:text-blue-700"
                  >
                    #{order._id.slice(-8).toUpperCase()}
                  </Link>
                  <p className="mt-2 text-sm text-slate-600">
                    Placed {formatDate(order.createdAt)}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(order.status)}`}
                >
                  {order.status.replaceAll("_", " ")}
                </span>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-sm text-slate-600">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "product" : "products"}
                </p>

                <ul className="mt-3 space-y-2">
                  {order.items.map((item) => (
                    <li
                      key={`${order._id}-${item.productId}`}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span className="text-slate-700">
                        {item.name}{" "}
                        <span className="text-slate-500">
                          × {item.quantity}
                        </span>
                      </span>
                      <span className="shrink-0 text-slate-700">
                        {formatPrice(item.lineTotalInPaise, order.currency)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-medium">Order total</span>
                  <span className="font-semibold">
                    {formatPrice(order.subtotalInPaise, order.currency)}
                  </span>
                </div>

                {order.status === "PENDING_PAYMENT" && (
                  <div className="mt-6 rounded-xl bg-slate-50 p-5">
                    <p className="text-sm font-medium text-slate-900">
                      Demo payment simulation
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Choose an outcome to test how the order status changes.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={isSimulating}
                        onClick={() =>
                          handleSimulatePayment(order._id, "SUCCESS")
                        }
                        className="rounded-full bg-[#071a33] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
                      >
                        {isSimulating && simulatingOrderId === order._id
                          ? "Processing…"
                          : "Simulate success"}
                      </button>

                      <button
                        type="button"
                        disabled={isSimulating}
                        onClick={() =>
                          handleSimulatePayment(order._id, "FAILURE")
                        }
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white disabled:opacity-60"
                      >
                        Simulate failure
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
