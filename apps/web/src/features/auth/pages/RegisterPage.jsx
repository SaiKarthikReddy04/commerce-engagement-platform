import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../useAuth.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-110px)] max-w-[1440px] items-center px-6 py-16 sm:px-12 lg:grid-cols-2 lg:gap-20 lg:px-20">
      <section className="hidden min-h-[600px] flex-col justify-between rounded-3xl bg-[#071a33] p-12 text-white lg:flex">
        <p className="text-sm font-semibold tracking-wide">
          COMMON<span className="text-blue-300">FORM</span>
        </p>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
            Join us
          </p>
          <h1 className="mt-5 max-w-lg text-5xl font-medium leading-tight">
            Make room for the good stuff.
          </h1>
          <p className="mt-5 max-w-md leading-7 text-white/70">
            Create an account to save your cart and follow your orders.
          </p>
        </div>

        <p className="text-sm text-white/50">
          Thoughtful essentials. Made for everyday life.
        </p>
      </section>

      <section className="mx-auto w-full max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
          Your account
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight text-slate-950">
          Create an account
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          A few details and you’re ready to shop.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              maxLength={120}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
              placeholder="Enter the password again"
            />
          </div>

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
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#071a33] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-700 hover:text-blue-900"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}