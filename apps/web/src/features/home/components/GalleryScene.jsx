import { Link } from "react-router";

const fallbackImages = [
  "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
];

function getImageUrl(product, index) {
  const image = product.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;

  return fallbackImages[index % fallbackImages.length];
}

export default function GalleryScene({ products = [] }) {
  const items = products.slice(0, 4);

  return (
    <section className="home-gallery-scene absolute inset-0 z-[70] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[1440px] overflow-hidden rounded-2xl bg-[#f4f6fa] px-6 py-8 text-[#071a33] sm:rounded-3xl sm:px-12 sm:py-10 lg:px-16">
        <div className="gallery-copy flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
              A closer look
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
              Everyday, <span className="font-serif italic">beautifully.</span>
            </h2>
          </div>

          <p className="hidden max-w-xs text-sm leading-6 text-slate-600 md:block">
            A few of the pieces that make daily rituals feel considered.
          </p>
        </div>

        <div className="gallery-grid mt-7 grid h-[52vh] min-h-[280px] grid-cols-2 grid-rows-2 gap-2 sm:gap-4 lg:grid-cols-4">
          {items.map((product, index) => {
            const productId = product._id ?? product.id;
            const layoutClass =
              index === 0
                ? "lg:col-span-2 lg:row-span-2"
                : index === 2
                  ? "lg:row-span-2"
                  : "";

            return (
              <Link
                key={productId}
                to={`/products/${productId}`}
                className={`gallery-image group relative min-h-0 overflow-hidden rounded-lg bg-slate-200 ${layoutClass}`}
              >
                <img
                  src={getImageUrl(product, index)}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06172c]/75 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/75 sm:text-xs">
                    {product.category || "The collection"}
                  </p>
                  <h3 className="mt-1 text-sm font-medium sm:text-lg">
                    {product.name}
                  </h3>
                </div>
              </Link>
            );
          })}

          {!items.length && (
            <p className="col-span-2 row-span-2 flex items-center justify-center text-slate-500 lg:col-span-4">
              The collection is loading.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
