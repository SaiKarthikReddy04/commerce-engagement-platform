import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function useCatalogMotion(scopeRef, productSignature) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // The hero copy and background respond continuously as the hero leaves view.
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".catalog-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        heroTimeline
          .to(
            ".catalog-hero-copy",
            {
              yPercent: -18,
              autoAlpha: 0.25,
              ease: "none",
            },
            0,
          )
          .to(
            ".catalog-hero-image",
            {
              yPercent: 12,
              scale: 1.12,
              ease: "none",
            },
            0,
          );

        // The collection panel rises over the hero as you scroll into it.
        gsap.fromTo(
          ".catalog-section",
          { y: 72 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".catalog-section",
              start: "top bottom",
              end: "top 45%",
              scrub: 1,
            },
          },
        );

        // Headline and filters ease into place with scroll progress.
        gsap.fromTo(
          ".catalog-section-heading",
          { y: 38, autoAlpha: 0.25 },
          {
            y: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".catalog-section-heading",
              start: "top 92%",
              end: "top 58%",
              scrub: 1,
            },
          },
        );

        gsap.fromTo(
          ".catalog-filter-bar",
          { y: 28, autoAlpha: 0.3 },
          {
            y: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".catalog-filter-bar",
              start: "top 94%",
              end: "top 68%",
              scrub: 1,
            },
          },
        );

        // Each product card and its image have their own scroll-linked movement.
        const cards = gsap.utils.toArray(
          ".catalog-product-card",
          scopeRef.current,
        );

        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 64, autoAlpha: 0.35, scale: 0.97 },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 96%",
                end: "top 62%",
                scrub: 1,
              },
            },
          );

          const image = card.querySelector("img");

          if (image) {
            gsap.fromTo(
              image,
              { scale: 1.12, yPercent: 4 },
              {
                scale: 1,
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          }
        });
      });

      return () => media.revert();
    },
    {
      scope: scopeRef,
      dependencies: [productSignature],
      revertOnUpdate: true,
    },
  );
}
