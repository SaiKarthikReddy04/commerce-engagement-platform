import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import HomeHeader from "../components/HomeHeader.jsx";
import HeroScene from "../components/HeroScene.jsx";
import FeaturedScene from "../components/FeaturedScene.jsx";
import BrandScene from "../components/BrandScene.jsx";
import { useListProductsQuery } from "../../catalog/api/catalogApi.js";
import CollectionsScene from "../components/CollectionsScene.jsx";
import ShowcaseScene from "../components/ShowcaseScene.jsx";
import ProductRailScene from "../components/ProductRailScene.jsx";
import GalleryScene from "../components/GalleryScene.jsx";
import ContactFooterScene from "../components/ContactFooterScene.jsx"; 

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

      let frameId;

      function animate(time) {
        lenis.raf(time);
        frameId = requestAnimationFrame(animate);
      }

      frameId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(frameId);
        lenis.destroy();
      };
    }, []);

    useEffect(() => {
      const images = document.querySelectorAll(".home-stage img");

      function refreshScroll() {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }

      images.forEach((image) => {
        image.addEventListener("load", refreshScroll);
      });

      refreshScroll();

      return () => {
        images.forEach((image) => {
          image.removeEventListener("load", refreshScroll);
        });
      };
    }, [featuredProduct?._id, secondaryProduct?._id, products.length]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const stage = stageRef.current;
        const homeHeader = stage?.querySelector(".home-header");
        const hero = stage?.querySelector(".home-hero-scene");
        const feature = stage?.querySelector(".home-feature-scene");
        const brand = stage?.querySelector(".home-brand-scene");

        if (!stage || !hero || !feature || !brand) return;

        const featureContent = feature.querySelectorAll(".feature-reveal");
        const brandCopy = brand.querySelector(".brand-copy");
        const primaryImage = brand.querySelector(".brand-image-primary");
        const secondaryImage = brand.querySelector(".brand-image-secondary");
        const collections = stage?.querySelector(".home-collections-scene");
        const collectionsRail = stage?.querySelector(".collections-rail");
        const showcase = stage?.querySelector(".home-showcase-scene");
        const collectionScene = stage?.querySelector(".home-collections-scene");
        const productRailScene = stage?.querySelector(
          ".home-product-rail-scene",
        );
        const productRail = stage?.querySelector(".product-rail");
        const gallery = stage?.querySelector(".home-gallery-scene");
        const contactScene = stage?.querySelector(".home-contact-scene");
        const contactLines = contactScene?.querySelectorAll(".contact-line");
        const contactDetails =
          contactScene?.querySelectorAll(".contact-detail");
        const contactImage = contactScene?.querySelector(".contact-image");
        const finalFooter = contactScene?.querySelector(".home-final-footer");

        gsap.set(feature, { yPercent: 100 });
        gsap.set(brand, { yPercent: 100 });
        gsap.set(collections, { yPercent: 100 });
        gsap.set(showcase, { yPercent: 100 });
        gsap.set(productRailScene, { yPercent: 100 });
        gsap.set(gallery, { yPercent: 100 });
        gsap.set(contactScene, { yPercent: 100 });
        gsap.set(contactLines, { yPercent: 110 });
        gsap.set(finalFooter, { yPercent: 100 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: experienceRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: stage,
            pinSpacing: false,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(
            hero,
            { scale: 0.95, yPercent: -8, autoAlpha: 0.48, duration: 1 },
            0,
          )
          .to(feature, { yPercent: 0, duration: 1 }, 0.18)
          .fromTo(
            featureContent,
            { y: 24, autoAlpha: 0, filter: "blur(8px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.45,
              stagger: 0.12,
            },
            0.55,
          )
          .to(feature, { yPercent: -10, autoAlpha: 0.45, duration: 1 }, 1.35)
          .to(brand, { yPercent: 0, duration: 1 }, 1.5)
          .fromTo(
            brandCopy,
            { y: 24, autoAlpha: 0, filter: "blur(8px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.6,
            },
            1.9,
          )
          .fromTo(
            primaryImage,
            { yPercent: 8, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.8 },
            1.75,
          )
          .fromTo(
            secondaryImage,
            { yPercent: 16, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.8 },
            1.95,
          )
          .to(primaryImage, { yPercent: -5, duration: 1, ease: "none" }, 2)
          .to(secondaryImage, { yPercent: -12, duration: 1, ease: "none" }, 2)
          .to(brand, { yPercent: -8, autoAlpha: 0.45, duration: 1 }, 3.05)
          .to(collections, { yPercent: 0, duration: 1 }, 3.2)
          .fromTo(
            collections.querySelectorAll(".collections-copy"),
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.12 },
            3.55,
          )
          .to(
            collectionsRail,
            {
              scrollLeft: () =>
                Math.max(
                  0,
                  collectionsRail.scrollWidth - collectionsRail.clientWidth,
                ),
              duration: 1.4,
              ease: "none",
            },
            3.65,
          )
          .to(
            collectionScene,
            { yPercent: -8, autoAlpha: 0.45, duration: 0.8 },
            5.05,
          )
          .to(showcase, { yPercent: 0, duration: 1 }, 5.25)
          .fromTo(
            showcase.querySelectorAll(".showcase-copy"),
            { y: 20, autoAlpha: 0, filter: "blur(6px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.5,
              stagger: 0.12,
            },
            5.7,
          )
          .fromTo(
            showcase.querySelectorAll(".showcase-image"),
            { yPercent: 14, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.7,
              stagger: 0.12,
            },
            5.55,
          )
          .to(
            showcase.querySelectorAll(".showcase-image"),
            {
              yPercent: (index) => (index === 1 ? -4 : -9),
              duration: 1,
              ease: "none",
            },
            6.3,
          )
          .to(showcase, { yPercent: -8, autoAlpha: 0.45, duration: 0.8 }, 7.1)
          .to(productRailScene, { yPercent: 0, duration: 1 }, 7.3)
          .fromTo(
            productRailScene.querySelectorAll(".product-rail-copy"),
            { y: 20, autoAlpha: 0, filter: "blur(6px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.5,
              stagger: 0.12,
            },
            7.65,
          )
          .fromTo(
            productRailScene.querySelectorAll(".product-rail-card"),
            { y: 30, autoAlpha: 0, filter: "blur(8px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.55,
              stagger: 0.1,
            },
            7.65,
          )
          .to(
            productRail,
            {
              scrollLeft: () =>
                Math.max(0, productRail.scrollWidth - productRail.clientWidth),
              duration: 1.2,
              ease: "none",
            },
            7.8,
          )
          .to(
            productRailScene,
            { yPercent: -8, autoAlpha: 0.45, duration: 0.8 },
            9.05,
          )
          .to(gallery, { yPercent: 0, duration: 1 }, 9.25)
          .fromTo(
            gallery.querySelectorAll(".gallery-copy"),
            { y: 20, autoAlpha: 0, filter: "blur(6px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.5,
            },
            9.65,
          )
          .fromTo(
            gallery.querySelectorAll(".gallery-image"),
            { y: 28, autoAlpha: 0, filter: "blur(8px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.6,
              stagger: 0.12,
            },
            9.7,
          )
          .to(gallery, { yPercent: -8, autoAlpha: 0.45, duration: 0.8 }, 10.5)
          .to(contactScene, { yPercent: 0, duration: 1 }, 10.7)
          .to(
            contactLines,
            { yPercent: 0, duration: 0.7, stagger: 0.14, ease: "power3.out" },
            11.15,
          )
          .fromTo(
            contactDetails,
            { y: 20, autoAlpha: 0, filter: "blur(6px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.5,
              stagger: 0.12,
            },
            11.55,
          )
          .fromTo(
            contactImage,
            { scale: 1.08, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.8 },
            11.55,
          )
          .to(finalFooter, { yPercent: 0, duration: 1 }, 12.25)
          //header
          .to(
            homeHeader,
            {
              backgroundColor: "rgba(244, 246, 250, 0.94)",
              color: "#071a33",
              borderColor: "rgba(7, 26, 51, 0.12)",
              duration: 0.25,
            },
            0.2,
          )
          .to(
            homeHeader,
            {
              backgroundColor: "rgba(244, 246, 250, 0.94)",
              color: "#071a33",
              borderColor: "rgba(7, 26, 51, 0.12)",
              duration: 0.25,
            },
            1.5,
          )
          .to(
            homeHeader,
            {
              backgroundColor: "rgba(244, 246, 250, 0.94)",
              color: "#071a33",
              borderColor: "rgba(7, 26, 51, 0.12)",
              duration: 0.25,
            },
            3.2,
          )
          .to(
            homeHeader,
            {
              backgroundColor: "rgba(6, 35, 63, 0.88)",
              color: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.2)",
              duration: 0.25,
            },
            5.25,
          )
          .to(
            homeHeader,
            {
              backgroundColor: "rgba(244, 246, 250, 0.94)",
              color: "#071a33",
              borderColor: "rgba(7, 26, 51, 0.12)",
              duration: 0.25,
            },
            7.3,
          )
          .to(
            homeHeader,
            {
              backgroundColor: "rgba(244, 246, 250, 0.94)",
              color: "#071a33",
              borderColor: "rgba(7, 26, 51, 0.12)",
              duration: 0.25,
            },
            9.25,
          )
          .to(
            homeHeader,
            {
              backgroundColor: "rgba(6, 35, 63, 0.88)",
              color: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.2)",
              duration: 0.25,
            },
            12.25,
          );
      });

    
          
      return () => media.revert();
    },
    {
      scope: experienceRef,
      dependencies: [featuredProduct?._id, secondaryProduct?._id],
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

        <div className="home-hero-scene absolute inset-0 z-10">
          <HeroScene product={featuredProduct} />
        </div>

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

      <div aria-hidden="true" className="home-scroll-runway" />
    </main>
  );
}
