import { Link } from "react-router";

function getImageUrl(product) {
  const image = product?.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;

  return "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=85";
}

export default function ContactFooterScene({ product }) {
  return (
    <section className="home-contact-scene absolute inset-0 z-[80] flex items-center justify-center p-4 sm:p-8">
      <div className="relative h-[82vh] w-full max-w-[1440px] overflow-hidden rounded-2xl bg-[#f4f6fa] text-[#071a33] sm:rounded-3xl">
        <div className="contact-content grid h-full items-center gap-8 px-6 py-10 sm:px-12 lg:grid-cols-[1fr_0.8fr] lg:px-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
              Here for the everyday
            </p>

            <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
              <span className="contact-line-mask">
                <span className="contact-line">Good things,</span>
              </span>
              <span className="contact-line-mask">
                <span className="contact-line font-serif italic">
                  thoughtfully chosen.
                </span>
              </span>
            </h2>

            <p className="contact-detail mt-6 max-w-md leading-7 text-slate-600">
              Need help with an order? Visit your order history to review its
              status and details.
            </p>

            <Link
              to="/orders"
              className="contact-detail mt-7 inline-flex rounded-md border border-[#071a33]/30 px-5 py-3 text-sm font-medium transition hover:border-[#071a33] hover:bg-[#071a33] hover:text-white"
            >
              View your orders{" "}
              <span className="ml-3" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>

          <div className="contact-image relative hidden h-[58vh] overflow-hidden rounded-xl bg-slate-200 lg:block">
            <img
              src={getImageUrl(product)}
              alt={product?.name || "A piece from the collection"}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06172c]/60 to-transparent" />
            <p className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.18em] text-white">
              Thoughtful essentials · Commonform
            </p>
          </div>
        </div>

        <footer className="home-final-footer absolute inset-0 z-10 flex flex-col justify-between bg-[#06233f] p-7 text-white sm:p-12 lg:p-16">
          <div className="flex items-center justify-between">
            <span className="font-serif text-3xl italic">CF</span>
            <span className="text-xs uppercase tracking-[0.2em] text-blue-100/70">
              Thoughtful essentials
            </span>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-blue-200">
              Made for daily rituals
            </p>
            <p className="mt-4 max-w-4xl text-4xl leading-tight sm:text-6xl lg:text-7xl">
              Thoughtful essentials.
              <br />
              <span className="font-serif italic text-blue-100">
                Made for everyday life.
              </span>
            </p>
          </div>

          <div className="flex flex-col justify-between gap-5 border-t border-white/20 pt-5 sm:flex-row sm:items-center">
            <p className="text-sm text-white/65">
              © {new Date().getFullYear()} Commonform
            </p>

            <nav aria-label="Footer navigation" className="flex gap-6 text-sm">
              <Link
                to="/CatalogPage"
                className="transition hover:text-blue-200"
              >
                Shop
              </Link>
              <Link to="/orders" className="transition hover:text-blue-200">
                Orders
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </section>
  );
}
