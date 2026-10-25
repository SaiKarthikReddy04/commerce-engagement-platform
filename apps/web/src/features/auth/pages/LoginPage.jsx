import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../useAuth.js";

function getReturnPath(locationState) {
  const from = locationState?.from;

  // Protected routes commonly pass the previous URL as an object.
  if (
    typeof from === "string" &&
    from.startsWith("/") &&
    !from.startsWith("//")
  ) {
    return from;
  }

  if (
    from?.pathname &&
    typeof from.pathname === "string" &&
    from.pathname.startsWith("/") &&
    !from.pathname.startsWith("//")
  ) {
    return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`;
  }

  return null;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await login({
        email: email.trim(),
        password,
      });

      const user = result?.user ?? result?.data?.user ?? result;
      const returnPath = getReturnPath(location.state);

      const destination =
        returnPath ?? (user?.role === "ADMIN" ? "/admin/products" : "/");

      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError?.message || "Sign-in failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-slate-100 px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto grid min-h-[min(700px,calc(100vh-8rem))] max-w-7xl items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
        <section className="flex min-h-[360px] flex-col justify-between rounded-[2rem] bg-[#071a35] p-8 text-white sm:p-12 lg:p-14">
          <Link
            to="/"
            aria-label="Commonform home"
            className="w-fit text-xl font-semibold tracking-tight"
          >
            COMMON<span className="text-blue-400">FORM</span>
          </Link>

          <div className="my-12">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
              Welcome back
            </p>
            <h1 className="max-w-xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Good things are just around the corner.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              Sign in to manage your cart and pick up where you left off.
            </p>
          </div>

          <p className="text-sm text-slate-400">
            Thoughtful essentials. Made for everyday life.
          </p>
        </section>

        <section className="flex items-center justify-center py-6 lg:py-12">
          <div className="w-full max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
              Your account
            </p>
            <h2 className="text-4xl font-medium tracking-tight text-slate-950">
              Sign in
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Enter your email and password to continue.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-900"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-900"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
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
                className="w-full rounded-full bg-[#071a35] px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-950 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-sm text-slate-600">
              New here?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-700 hover:text-blue-900"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
