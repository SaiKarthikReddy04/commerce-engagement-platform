import { useRef } from "react";
import { Link } from "react-router";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const fallbackImage =
  "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85";

function getProductImage(product) {
  const image = product?.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;

  return fallbackImage;
}

export default function HeroScene({ product }) {
  const sceneRef = useRef(null);
  const productId = product?._id ?? product?.id;

  useGSAP(
    () => {
        const root = sceneRef.current;

        if (
          !root ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          return;
        }

        const featureVisual = root.querySelector(".home-feature-visual");

        gsap.set(
          [
            ".home-stage-water",
            ".home-panel-water",
            ".home-headline-line",
            ".home-hero-meta",
            ".home-hero-cta",
          ],
          { autoAlpha: 0 },
        );

        if (featureVisual) {
          gsap.set(featureVisual, { autoAlpha: 0 });
        }

        const intro = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        intro
          .to(".home-stage-water", {
            autoAlpha: 0.88,
            duration: 0.9,
          })
          .to(
            ".home-panel-water",
            {
              autoAlpha: 0.3,
              duration: 0.9,
            },
            "-=0.45",
          );

        if (featureVisual) {
          intro.fromTo(
            featureVisual,
            { autoAlpha: 0, scale: 0.9, y: 24 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.95 },
            "+=0.08",
          );
        }

        intro
          .fromTo(
            ".home-headline-line",
            { autoAlpha: 0, yPercent: 110 },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.85,
              stagger: 0.1,
            },
            "-=0.12",
          )
          .fromTo(
            ".home-hero-meta",
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.12 },
            "-=0.18",
          )
          .fromTo(
            ".home-hero-cta",
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.65 },
            "-=0.15",
          );

        if (featureVisual) {
          intro.to(featureVisual, {
            y: -7,
            duration: 2.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
    },
    { scope: sceneRef, dependencies: [productId], revertOnUpdate: true },
  );

  return (
    <div
      ref={sceneRef}
      className="relative isolate grid min-h-[100svh] place-items-center overflow-hidden bg-transparent p-2 sm:p-4 lg:p-5"
    >
      {/* <div className="absolute inset-0 -z-10 bg-[#489ae1]" /> */}

      {/* Inset hero panel */}
      <section className="relative isolate flex min-h-[calc(100svh-1rem)] w-full max-w-[1440px] flex-col overflow-hidden rounded-xl border border-white/15 bg-[#06233f] sm:min-h-[calc(100svh-2rem)] sm:rounded-2xl">
        <img
          className="home-panel-water absolute inset-0 -z-20 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2200&q=85"
          alt=""
          aria-hidden="true"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#06233f]/75 via-[#06233f]/65 to-[#06233f]/90" />

        {/* <nav
          aria-label="Home"
          className="relative z-30 flex items-center justify-between gap-4 px-5 py-5 text-xs text-white/80 sm:px-8 sm:py-6 sm:text-sm lg:px-12"
        >
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/CatalogPage" className="transition hover:text-white">
              Shop
            </Link>
            <Link
              to="/orders"
              className="hidden transition hover:text-white sm:block"
            >
              Orders
            </Link>
          </div>

          <Link
            to="/"
            aria-label="Commonform home"
            className="home-display-italic absolute left-1/2 -translate-x-1/2 text-3xl text-white sm:text-4xl"
          >
            CF
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/cart" className="transition hover:text-white">
              Cart
            </Link>
            <Link
              to="/register"
              className="rounded-md border border-white/35 px-3 py-2 text-white transition hover:bg-white/10 sm:px-4"
            >
              Join
            </Link>
          </div>
        </nav> */}

        <div className="relative flex flex-1 flex-col items-center justify-center px-5 pb-16 pt-8 text-center sm:px-10">
          <p className="home-hero-meta relative z-10 text-[10px] font-medium uppercase tracking-[0.32em] text-[#c4e4f4] sm:text-xs">
            Thoughtful essentials · Commonform
          </p>

          <h1 className="relative z-10 mt-7 text-5xl font-medium leading-[0.92] tracking-[-0.055em] text-white sm:text-7xl lg:text-[clamp(5rem,10vw,9rem)]">
            <span className="block overflow-hidden pb-2">
              <span className="home-headline-line inline-block">Everyday</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="home-headline-line home-display-italic inline-block">
                essentials.
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="home-headline-line inline-block">
                Considered well.
              </span>
            </span>
          </h1>

          {product && (
            <Link
              to={productId ? `/products/${productId}` : "/"}
              aria-label={`Discover ${product.name}`}
              className="home-feature-visual absolute left-1/2 top-[55%] z-20 block w-[min(42vw,300px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/25 bg-white/10 shadow-2xl shadow-black/30 sm:left-[58%] sm:top-[54%] sm:w-[min(30vw,360px)]"
            >
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="aspect-[4/5] w-full object-cover"
              />
            </Link>
          )}

          <div className="home-hero-meta absolute bottom-28 left-6 hidden text-left sm:block lg:left-12">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">
              The everyday edit
            </p>
            <p className="mt-2 text-sm text-white/85">Made for daily rituals</p>
          </div>

          <div className="home-hero-meta absolute bottom-28 right-6 hidden text-right sm:block lg:right-12">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">
              Featured piece
            </p>
            <p className="mt-2 max-w-48 text-sm text-white/85">
              {product?.name ?? "A considered essential"}
            </p>
          </div>

          <Link
            to={productId ? `/products/${productId}` : "/"}
            className="home-hero-cta relative z-30 mt-9 inline-flex items-center gap-3 rounded-md border border-white/70 bg-white/95 px-5 py-3 text-xs font-semibold text-[#06233f] transition hover:bg-white sm:mt-12 sm:text-sm"
          >
            Discover the piece
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
