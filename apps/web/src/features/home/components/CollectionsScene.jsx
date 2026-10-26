import { useRef } from "react";
import { Link } from "react-router";

function getImageUrl(product) {
  const image = product.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;

  return "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85";
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: price?.currency || "INR",
  }).format((price?.amountInPaise || 0) / 100);
}

export default function CollectionsScene({ products = [] }) {
  const railRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });
  const cursorRef = useRef(null);

  function handlePointerDown(event) {
    if (event.pointerType !== "mouse" || !railRef.current) return;

    dragRef.current = {
      active: true,
      startX: event.clientX,
      startScroll: railRef.current.scrollLeft,
    };

    railRef.current.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    }

    if (dragRef.current.active && railRef.current) {
      railRef.current.scrollLeft =
        dragRef.current.startScroll - (event.clientX - dragRef.current.startX);
    }
  }

  function handlePointerUp() {
    dragRef.current.active = false;
  }

  return (
    <section className="home-collections-scene absolute inset-0 z-40 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[1440px] overflow-hidden rounded-2xl bg-[#eaf0f5] py-8 text-[#071a33] sm:rounded-3xl sm:py-12">
        <div className="collections-copy mx-auto flex max-w-[1280px] items-end justify-between gap-6 px-6 sm:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
              Considered essentials
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
              Find your <span className="font-serif italic">everyday.</span>
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm leading-6 text-slate-600 md:block">
            Useful pieces, selected for quality and made to be part of your
            daily rituals.
          </p>
        </div>

        <div
          ref={railRef}
          className="collections-rail mt-8 cursor-grab overflow-x-auto px-6 active:cursor-grabbing sm:px-10"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerEnter={() => {
            if (cursorRef.current) cursorRef.current.style.opacity = "1";
          }}
          onPointerLeave={() => {
            if (cursorRef.current) cursorRef.current.style.opacity = "0";
            handlePointerUp();
          }}
        >
          <div className="collections-track flex w-max gap-4 sm:gap-6">
            {products.map((product, index) => {
              const productId = product._id ?? product.id;

              return (
                <Link
                  key={productId}
                  to={`/products/${productId}`}
                  className="collection-card block h-[48vh] min-h-[320px] w-[min(78vw,360px)] [perspective:1200px]"
                  onClick={(event) => {
                    if (dragRef.current.active) event.preventDefault();
                  }}
                >
                  <div className="collection-card__inner relative h-full w-full">
                    <div className="collection-card__face flex h-full flex-col justify-between rounded-xl border border-slate-300/70 bg-[#f7f8fa] p-6 sm:p-8">
                      <span className="font-serif text-5xl italic text-blue-800/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          {product.category || "The collection"}
                        </p>
                        <h3 className="mt-3 text-xl font-medium">
                          {product.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                          {product.description}
                        </p>
                        <p className="mt-6 font-semibold">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>

                    <div
                      className="collection-card__face collection-card__back flex h-full flex-col justify-end rounded-xl bg-cover bg-center p-6 text-white sm:p-8"
                      style={{
                        backgroundImage: `linear-gradient(to top, rgba(4, 23, 43, .85), transparent 65%), url("${getImageUrl(product)}")`,
                      }}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-white/75">
                        {product.category || "Selected for you"}
                      </p>
                      <h3 className="mt-2 text-2xl font-medium">
                        {product.name}
                      </h3>
                      <span className="mt-4 text-sm">Discover the piece ↗</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <p className="collections-copy mt-5 px-6 text-xs uppercase tracking-[0.18em] text-slate-500 sm:px-10">
          Drag to explore · {products.length} pieces
        </p>
      </div>

      <div
        ref={cursorRef}
        className="collections-drag-cursor"
        aria-hidden="true"
      >
        Drag
      </div>
    </section>
  );
}
