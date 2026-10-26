import { Link } from "react-router";

function getImageUrl(product, index) {
  const image = product?.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;

  const fallbacks = [
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
  ];

  return fallbacks[index % fallbacks.length];
}

export default function ShowcaseScene({ products = [] }) {
  const items = products.slice(0, 3);

  if (!items.length) return null;

  return (
    <section className="home-showcase-scene absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[1440px] overflow-hidden rounded-2xl bg-[#0b3454] px-6 py-8 text-white sm:rounded-3xl sm:px-12 sm:py-10 lg:px-16">
        <div className="showcase-copy flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">
              The everyday edit
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
              Form meets <span className="font-serif italic">function.</span>
            </h2>
          </div>

          <p className="hidden max-w-xs text-sm leading-6 text-white/65 md:block">
            Three thoughtful pieces. Made to work beautifully, every day.
          </p>
        </div>

        <div className="showcase-images mt-7 grid h-[48vh] min-h-[300px] grid-cols-3 items-center gap-3 sm:mt-8 sm:gap-6">
          {items.map((product, index) => {
            const productId = product._id ?? product.id;
            const isCenter = index === 1;

            return (
              <Link
                key={productId}
                to={`/products/${productId}`}
                className={`showcase-image group relative block overflow-hidden rounded-lg bg-[#16496c] ${
                  isCenter ? "h-full" : "h-[78%] translate-y-5 sm:translate-y-8"
                }`}
              >
                <img
                  src={getImageUrl(product, index)}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06172c]/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/70 sm:text-xs">
                    {product.category || "The collection"}
                  </p>
                  <h3 className="mt-1 text-sm font-medium sm:text-lg">
                    {product.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="showcase-copy mt-5 text-center font-serif text-lg italic text-blue-100 sm:text-xl">
          Considered in every detail.
        </p>
      </div>
    </section>
  );
}
