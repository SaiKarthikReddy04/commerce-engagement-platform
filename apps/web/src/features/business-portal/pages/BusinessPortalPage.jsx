import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../auth/useAuth.js";
import { useCreateOrganizationMutation } from "../api/businessPortalApi.js";
import OrganizationMembersPanel from "../components/OrganizationMembersPanel.jsx";
import PendingOrganizationOrdersPanel from "../components/PendingOrganizationOrdersPanel.jsx";

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BusinessPortalPage() {
  const { isAuthenticated } = useAuth();
  const [createOrganization, { isLoading, error }] =
    useCreateOrganizationMutation();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [spendingLimit, setSpendingLimit] = useState("");
  const [organization, setOrganization] = useState(null);
  const [formError, setFormError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const amount = spendingLimit.trim()
      ? Math.round(Number(spendingLimit) * 100)
      : null;

    if (spendingLimit.trim() && (!Number.isFinite(amount) || amount < 0)) {
      setFormError("Enter a valid non-negative spending limit.");
      return;
    }

    try {
      const result = await createOrganization({
        name: name.trim(),
        slug: slug.trim(),
        requiresApproval,
        spendingLimitInPaise: amount,
      }).unwrap();

      const createdOrganization = result.organization;
      setOrganization(createdOrganization);
        localStorage.setItem("activeOrganizationId", createdOrganization._id);
        localStorage.setItem(
          "activeOrganization",
          JSON.stringify(createdOrganization),
        );
    } catch {
      // The API error is displayed below.
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
          Business portal
        </p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight">
          Sign in to continue
        </h1>
        <p className="mt-4 text-slate-600">
          Sign in to create or manage an organization.
        </p>
        <Link
          to="/login"
          state={{ from: "/business" }}
          className="mt-8 inline-flex rounded-full bg-[#071a33] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900"
        >
          Sign in
        </Link>
      </main>
    );
  }

  const errorMessage =
    formError || error?.data?.error?.message || error?.error || "";

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:px-10 lg:px-16">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
        Business portal
      </p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">Organization</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        Set up an organization for team purchasing and order approvals.
      </p>

      {organization ? (
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Organization created
          </p>
          <OrganizationMembersPanel organizationId={organization._id} />
          <PendingOrganizationOrdersPanel organizationId={organization._id} />
          <h2 className="mt-3 text-2xl font-medium">{organization.name}</h2>
          <p className="mt-2 text-slate-600">Slug: {organization.slug}</p>
          <p className="mt-2 text-sm text-slate-500">
            Your organization ID: {organization._id}
          </p>
          <p className="mt-4 text-sm text-slate-600">
            {organization.requiresApproval
              ? "Orders require approval before payment."
              : "Orders do not require approval."}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            You are the organization admin.
          </p>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-white p-7 sm:p-9"
        >
          <div>
            <label
              htmlFor="organization-name"
              className="mb-2 block text-sm font-medium"
            >
              Organization name
            </label>
            <input
              id="organization-name"
              required
              maxLength={160}
              value={name}
              onChange={(event) => {
                const value = event.target.value;
                setName(value);
                setSlug(makeSlug(value));
              }}
              placeholder="Example: Northstar Studio"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="organization-slug"
              className="mb-2 block text-sm font-medium"
            >
              Organization URL name
            </label>
            <input
              id="organization-slug"
              required
              maxLength={100}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              value={slug}
              onChange={(event) => setSlug(makeSlug(event.target.value))}
              placeholder="northstar-studio"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
            <p className="mt-2 text-xs text-slate-500">
              Use lowercase letters, numbers, and hyphens.
            </p>
          </div>

          <div>
            <label
              htmlFor="spending-limit"
              className="mb-2 block text-sm font-medium"
            >
              Spending limit (₹, optional)
            </label>
            <input
              id="spending-limit"
              type="number"
              min="0"
              step="0.01"
              value={spendingLimit}
              onChange={(event) => setSpendingLimit(event.target.value)}
              placeholder="No limit"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={requiresApproval}
              onChange={(event) => setRequiresApproval(event.target.checked)}
              className="mt-1 h-4 w-4 accent-blue-800"
            />
            <span>
              <span className="block text-sm font-medium">
                Require approval for organization orders
              </span>
              <span className="mt-1 block text-sm text-slate-600">
                An organization admin or approver must approve orders before
                payment.
              </span>
            </span>
          </label>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-[#071a33] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating organization…" : "Create organization"}
          </button>
        </form>
      )}
    </main>
  );
}
