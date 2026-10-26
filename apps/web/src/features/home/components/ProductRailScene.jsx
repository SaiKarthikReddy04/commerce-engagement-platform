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

export default function ProductRailScene({ products = [] }) {
  const railRef = useRef(null);
  const cursorRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });
  const draggedRef = useRef(false);

  function handlePointerDown(event) {
    if (event.pointerType !== "mouse" || !railRef.current) return;

    dragRef.current = {
      active: true,
      startX: event.clientX,
      startScroll: railRef.current.scrollLeft,
    };
    draggedRef.current = false;
    railRef.current.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    }

    if (!dragRef.current.active || !railRef.current) return;

    const distance = event.clientX - dragRef.current.startX;
    if (Math.abs(distance) > 5) draggedRef.current = true;

    railRef.current.scrollLeft = dragRef.current.startScroll - distance;
  }

  function handlePointerUp() {
    dragRef.current.active = false;
  }

  return (
    <section className="home-product-rail-scene absolute inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[1440px] overflow-hidden rounded-2xl bg-[#f4f6fa] py-8 text-[#071a33] sm:rounded-3xl sm:py-12">
        <div className="product-rail-copy mx-auto flex max-w-[1280px] items-end justify-between gap-6 px-6 sm:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
              The everyday edit
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
              Pieces with <span className="font-serif italic">purpose.</span>
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm leading-6 text-slate-600 md:block">
            Explore the details, materials, and stories behind our favorites.
          </p>
        </div>

        <div
          ref={railRef}
          className="product-rail mt-8 cursor-grab overflow-x-auto px-6 active:cursor-grabbing sm:px-10"
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
          <div className="product-rail-track flex w-max gap-4 sm:gap-6">
            {products.slice(0, 12).map((product, index) => {
              const productId = product._id ?? product.id;

              return (
                <Link
                  key={productId}
                  to={`/products/${productId}`}
                  onClick={(event) => {
                    if (draggedRef.current) {
                      event.preventDefault();
                      draggedRef.current = false;
                    }
                  }}
                  className={`product-rail-card group w-[min(72vw,310px)] overflow-hidden rounded-xl border border-slate-200 bg-white ${
                    index === 0 ? "product-rail-card--featured" : ""
                  }`}
                >
                  <div className="h-[34vh] min-h-[210px] overflow-hidden bg-slate-200">
                    <img
                      src={getImageUrl(product)}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      {product.category || "The collection"}
                    </p>
                    <h3 className="mt-2 text-lg font-medium">{product.name}</h3>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="font-semibold">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {product.stockQuantity > 0
                          ? `${product.stockQuantity} available`
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <p className="product-rail-copy mt-5 px-6 text-xs uppercase tracking-[0.18em] text-slate-500 sm:px-10">
          Drag to explore · {Math.min(products.length, 12)} pieces
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
