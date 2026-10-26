import { Link } from "react-router";

function getImageUrl(product) {
  const image = product?.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;

  return "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1400&q=85";
}

export default function FeaturedScene({ product }) {
  if (!product) return null;

  const productId = product._id ?? product.id;

  return (
    <section className="home-feature-scene absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-8">
      <div className="grid min-h-[82vh] w-full max-w-[1440px] overflow-hidden rounded-2xl bg-[#f4f6fa] text-[#071a33] shadow-2xl sm:rounded-3xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
          <div className="feature-reveal">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
              A considered favorite
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
              Made for
              <br />
              everyday <span className="font-serif italic">rituals.</span>
            </h2>

            <p className="mt-6 max-w-md leading-7 text-slate-600">
              {product.description ||
                "Thoughtful design, made to bring a little more care to the everyday."}
            </p>

            <p className="mt-8 text-lg font-semibold">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: product.price?.currency || "INR",
              }).format((product.price?.amountInPaise || 0) / 100)}
            </p>

            <Link
              to={productId ? `/products/${productId}` : "/"}
              className="mt-7 inline-flex rounded-md border border-[#071a33]/30 px-5 py-3 text-sm font-medium transition hover:border-[#071a33] hover:bg-[#071a33] hover:text-white"
            >
              Discover the piece{" "}
              <span className="ml-3" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
        </div>

        <div className="feature-reveal relative min-h-[340px] overflow-hidden bg-[#dce5ed] lg:min-h-full">
          <img
            src={getImageUrl(product)}
            alt={product.name}
            className="h-full min-h-[340px] w-full object-cover lg:absolute lg:inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071a33]/35 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 text-xs font-medium uppercase tracking-[0.2em] text-white sm:bottom-9 sm:left-9">
            Featured piece · {product.category || "The collection"}
          </p>
        </div>
      </div>
    </section>
  );
}
