import { useState } from "react";
import {
  useAddOrganizationMemberMutation,
  useGetOrganizationMembersQuery,
} from "../api/businessPortalApi.js";

export default function OrganizationMembersPanel({ organizationId }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("BUYER");
  const [feedback, setFeedback] = useState("");

  const {
    data: members = [],
    isLoading,
    error: membersError,
  } = useGetOrganizationMembersQuery(organizationId, {
    skip: !organizationId,
  });

  const [addMember, { isLoading: isAdding, error: addError }] =
    useAddOrganizationMemberMutation();

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");

    try {
      await addMember({
        organizationId,
        email: email.trim(),
        role,
      }).unwrap();

      setEmail("");
      setFeedback("Member added.");
    } catch {
      // The API error is shown below.
    }
  }

  const errorMessage =
    addError?.data?.error?.message ||
    addError?.error ||
    membersError?.data?.error?.message ||
    membersError?.error ||
    "";

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
        Team access
      </p>
      <h2 className="mt-3 text-2xl font-medium">Organization members</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Add existing users as buyers or approvers. They must already have an
        account.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 sm:grid-cols-[1fr_180px_auto]"
      >
        <label className="sr-only" htmlFor="member-email">
          Member email
        </label>
        <input
          id="member-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="member@example.com"
          className="min-w-0 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
        />

        <label className="sr-only" htmlFor="member-role">
          Organization role
        </label>
        <select
          id="member-role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
        >
          <option value="BUYER">Buyer</option>
          <option value="APPROVER">Approver</option>
        </select>

        <button
          type="submit"
          disabled={isAdding}
          className="rounded-full bg-[#071a33] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAdding ? "Adding…" : "Add member"}
        </button>
      </form>

      {errorMessage && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      {feedback && (
        <p role="status" className="mt-4 text-sm text-emerald-700">
          {feedback}
        </p>
      )}

      <div className="mt-8 border-t border-slate-100 pt-6">
        <h3 className="font-medium">Current team</h3>

        {isLoading ? (
          <p className="mt-4 text-sm text-slate-500">Loading members…</p>
        ) : members.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No members found for this organization.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {members.map((member) => {
              const person =
                member.userId && typeof member.userId === "object"
                  ? member.userId
                  : null;

              return (
                <li
                  key={member._id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {person?.name || person?.email || "Organization member"}
                    </p>
                    {person?.email && (
                      <p className="mt-1 text-sm text-slate-500">
                        {person.email}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {member.role}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
