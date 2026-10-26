import { Link } from "react-router";

function getImageUrl(product, fallback) {
  const image = product?.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;

  return fallback;
}

export default function BrandScene({ primaryProduct, secondaryProduct }) {
  const primaryImage = getImageUrl(
    primaryProduct,
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=85",
  );

  const secondaryImage = getImageUrl(
    secondaryProduct,
    "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",
  );

  return (
    <section className="home-brand-scene absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-8">
      <div className="grid min-h-[82vh] w-full max-w-[1440px] items-center gap-8 overflow-hidden rounded-2xl bg-[#f4f6fa] px-6 py-10 text-[#071a33] sm:rounded-3xl sm:px-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:px-16">
        <div className="brand-copy">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
            The Commonform point of view
          </p>

          <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
            Less, but
            <br />
            <span className="font-serif italic">better.</span>
          </h2>

          <p className="mt-6 max-w-md leading-7 text-slate-600">
            We choose useful, lasting pieces for the small rituals that make up
            everyday life.
          </p>

          <p className="mt-4 max-w-md leading-7 text-slate-600">
            Thoughtful materials, considered details, and design that earns its
            place in your home.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex rounded-md border border-[#071a33]/30 px-5 py-3 text-sm font-medium transition hover:border-[#071a33] hover:bg-[#071a33] hover:text-white"
          >
            Explore the collection{" "}
            <span className="ml-3" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>

        <div className="brand-images relative min-h-[380px] sm:min-h-[480px]">
          <figure className="brand-image-primary absolute left-0 top-0 h-[78%] w-[68%] overflow-hidden rounded-xl bg-slate-200">
            <img
              src={primaryImage}
              alt={primaryProduct?.name || "A featured Commonform product"}
              className="h-full w-full object-cover"
            />
          </figure>

          <figure className="brand-image-secondary absolute bottom-0 right-0 h-[48%] w-[43%] overflow-hidden rounded-xl border-8 border-[#f4f6fa] bg-slate-200">
            <img
              src={secondaryImage}
              alt={
                secondaryProduct?.name || "Another piece from the collection"
              }
              className="h-full w-full object-cover"
            />
          </figure>

          <p className="absolute bottom-2 left-0 text-xs uppercase tracking-[0.18em] text-slate-500">
            Chosen for everyday life
          </p>
        </div>
      </div>
    </section>
  );
}
