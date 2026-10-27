import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import HomeCollageOverview from "../components/HomeCollageOverview.jsx";
import HomeHeader from "../components/HomeHeader.jsx";
import HeroScene from "../components/HeroScene.jsx";
import FeaturedScene from "../components/FeaturedScene.jsx";
import AboutSection from "../components/AboutSection.jsx";
import BrandScene from "../components/BrandScene.jsx";
import { useListProductsQuery } from "../../catalog/api/catalogApi.js";
import CollectionsScene from "../components/CollectionsScene.jsx";
import ShowcaseScene from "../components/ShowcaseScene.jsx";
import ProductRailScene from "../components/ProductRailScene.jsx";
import GalleryScene from "../components/GalleryScene.jsx";
import ContactFooterScene from "../components/ContactFooterScene.jsx";

import {
  buildHomeTimeline,
  SCROLL_VH_PER_UNIT,
  SCROLL_VH_PER_UNIT_MOBILE,
} from "./homeTimeline.js";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HomePage() {
  const experienceRef = useRef(null);
  const stageRef = useRef(null);

  const { data, isLoading, error } = useListProductsQuery({
    page: 1,
    limit: 20,
    sort: "newest",
  });

  const products = data?.products ?? [];
  const featuredProduct =
    products.find((product) =>
      /bottle|backpack|camera|headphones/i.test(product.name),
    ) ?? products[0];

  const secondaryProduct =
    products.find(
      (product) =>
        (product._id ?? product.id) !==
        (featuredProduct?._id ?? featuredProduct?.id),
    ) ?? featuredProduct;

  // Changes whenever the rendered product list changes, so the timeline is
  // rebuilt against the NEW DOM nodes (not stale, detached ones).
  const productsKey = products
    .map((product) => product._id ?? product.id)
    .join(",");

  /* ---------------- smooth scroll (Lenis driven by GSAP's ticker) ---------------- */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  /* ------- re-measure the rails once images finish loading (debounced) ------- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    let timer;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };

    const pending = Array.from(stage.querySelectorAll("img")).filter(
      (image) => !image.complete,
    );
    pending.forEach((image) =>
      image.addEventListener("load", refresh, { once: true }),
    );

    return () => {
      clearTimeout(timer);
      pending.forEach((image) => image.removeEventListener("load", refresh));
    };
  }, [productsKey]);

  /* ---------------- the pinned, scroll-scrubbed experience ---------------- */
  useGSAP(
    () => {
      if (isLoading) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const stage = stageRef.current;
        if (!stage) return;

        const timeline = buildHomeTimeline(stage);
        if (!timeline) return;

        ScrollTrigger.create({
          animation: timeline,
          trigger: stage,
          start: "top top",
          // Scroll length follows the timeline length, so adding or removing
          // a scene can never leave blank scroll or cut the ending off.
          end: () => {
            const perUnit =
              window.innerWidth < 768
                ? SCROLL_VH_PER_UNIT_MOBILE
                : SCROLL_VH_PER_UNIT;
            return `+=${Math.round(window.innerHeight * perUnit * timeline.duration())}`;
          },
          pin: true,
          // Lenis already smooths the wheel, so keep scrub smoothing light.
          scrub: 1,
          invalidateOnRefresh: true,
        });
      });

      return () => media.revert();
    },
    {
      scope: experienceRef,
      dependencies: [productsKey, isLoading],
      revertOnUpdate: true,
    },
  );

  return (
    <main ref={experienceRef} className="home-experience relative bg-[#06233f]">
      <div
        ref={stageRef}
        className="home-stage relative h-screen overflow-hidden"
      >
        <img
          className="home-stage-water pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=85"
          alt=""
          aria-hidden="true"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[#06233f]/35"
        />
        <HomeHeader />

        <div className="home-hero-scene absolute inset-0 z-[95]">
          <HeroScene product={featuredProduct} />
        </div>

        <AboutSection
          largeProduct={featuredProduct}
          smallProduct={secondaryProduct}
        />

        <FeaturedScene product={featuredProduct} />

        <BrandScene
          primaryProduct={featuredProduct}
          secondaryProduct={secondaryProduct}
        />

        <CollectionsScene products={products} />

        <ShowcaseScene products={products} />

        <ProductRailScene products={products} />

        <GalleryScene products={products} />

        <ContactFooterScene product={featuredProduct} />

        <HomeCollageOverview products={products} />

        {isLoading && (
          <p className="absolute bottom-5 left-5 z-40 text-sm text-white/70">
            Loading the collection…
          </p>
        )}

        {error && (
          <p
            role="status"
            className="absolute bottom-5 left-5 z-40 text-sm text-white"
          >
            The featured pieces are unavailable right now.
          </p>
        )}
      </div>

    </main>
  );
}
