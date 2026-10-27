import gsap from "gsap";

export const ENTER = 1;
export const REVEAL_AT = 0.6;
export const SCENE_GAP = 0.35;
export const SCROLL_VH_PER_UNIT = 0.55;
export const SCROLL_VH_PER_UNIT_MOBILE = 0.45;

const HEADER_FLIP_AT = 0.7;
const RECEDE = { yPercent: -8, autoAlpha: 0.45 };

const HEADER_THEMES = {
  light: {
    backgroundColor: "rgba(244, 246, 250, 0.94)",
    color: "#071a33",
    borderColor: "rgba(7, 26, 51, 0.12)",
  },
  dark: {
    backgroundColor: "rgba(6, 35, 63, 0.88)",
    color: "#ffffff",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
};

/* ------------------------------ helpers ----------------------------- */
const q = (root, selector) => root?.querySelector(selector) ?? null;
const qa = (root, selector) =>
  root ? gsap.utils.toArray(root.querySelectorAll(selector)) : [];

function reveal(tl, targets, from, to, at) {
  const list = gsap.utils.toArray(targets).filter(Boolean);
  if (!list.length) return;
  tl.fromTo(list, from, to, at);
}

function blurIn(tl, targets, at, opts = {}) {
  const { y = 20, blur = 6, duration = 0.5, stagger = 0.12 } = opts;

  reveal(
    tl,
    targets,
    { y, autoAlpha: 0, filter: `blur(${blur}px)` },
    {
      y: 0,
      autoAlpha: 1,
      filter: "blur(0px)",
      duration,
      stagger,
      ease: "power3.out",
    },
    at,
  );
}

function scrollRail(tl, rail, at, duration) {
  if (!rail) return;

  tl.to(
    rail,
    {
      scrollLeft: () => Math.max(0, rail.scrollWidth - rail.clientWidth),
      duration,
    },
    at,
  );
}

/* --------------------------- scene reveals --------------------------- */
function revealAbout({ tl }, el, at) {
  reveal(
    tl,
    qa(el, ".about-heading-line"),
    { yPercent: 110 },
    { yPercent: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" },
    at,
  );

  const hidden = { autoAlpha: 0, y: 10 };
  const shown = { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" };

  reveal(tl, q(el, ".about-note"), { ...hidden }, { ...shown }, at + 0.1);

  qa(el, ".about-paragraph").forEach((paragraph, i) => {
    reveal(tl, paragraph, { ...hidden }, { ...shown }, at + 0.3 + i * 0.15);
  });

  reveal(
    tl,
    q(el, ".about-button"),
    { ...hidden },
    { ...shown, duration: 0.7 },
    at + 0.7,
  );

  [".about-image-large", ".about-image-small"].forEach((selector, i) => {
    const image = q(el, selector);
    if (!image) return;

    const start = at + 0.35 + i * 0.45;

    reveal(
      tl,
      image,
      {
        clipPath: "inset(40% 0% 0% 0%)",
        autoAlpha: 0.4,
        filter: "blur(6px)",
      },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out",
      },
      start,
    );

    reveal(
      tl,
      q(image, "img"),
      { scale: 1.12 },
      { scale: 1, duration: 1.2, ease: "power3.out" },
      start,
    );
  });
}

function revealFeature({ tl }, el, at) {
  blurIn(tl, qa(el, ".feature-reveal"), at, {
    y: 24,
    blur: 8,
    duration: 0.45,
  });
}

function revealBrand({ tl }, el, at) {
  const primary = q(el, ".brand-image-primary");
  const secondary = q(el, ".brand-image-secondary");

  reveal(
    tl,
    primary,
    { yPercent: 8, autoAlpha: 0 },
    { yPercent: 0, autoAlpha: 1, duration: 0.3 },
    at,
  );

  reveal(
    tl,
    secondary,
    { yPercent: 16, autoAlpha: 0 },
    { yPercent: 0, autoAlpha: 1, duration: 0.3 },
    at + 0.2,
  );

  blurIn(tl, q(el, ".brand-copy"), at + 0.15, {
    y: 24,
    blur: 8,
    duration: 0.1,
  });

  const drift = tl.duration();

  if (primary) {
    tl.to(primary, { yPercent: -5, duration: 0.4 }, drift);
  }

  if (secondary) {
    tl.to(secondary, { yPercent: -12, duration: 0.4 }, drift);
  }
}

function revealCollections({ tl }, el, at) {
  reveal(
    tl,
    qa(el, ".collections-copy"),
    { y: 20, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.12 },
    at,
  );

  scrollRail(tl, q(el, ".collections-rail"), at + 0.1, 1.4);
}

function revealShowcase({ tl }, el, at) {
  const images = qa(el, ".showcase-image");

  reveal(
    tl,
    images,
    { yPercent: 14, autoAlpha: 0 },
    { yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.12 },
    at,
  );

  blurIn(tl, qa(el, ".showcase-copy"), at + 0.15, { duration: 0.5 });

  if (images.length) {
    tl.to(
      images,
      { yPercent: (index) => (index === 1 ? -4 : -9), duration: 1 },
      tl.duration(),
    );
  }
}

function revealProductRail({ tl }, el, at) {
  blurIn(tl, qa(el, ".product-rail-copy"), at, { duration: 0.5 });

  blurIn(tl, qa(el, ".product-rail-card"), at, {
    y: 30,
    blur: 8,
    duration: 0.55,
    stagger: 0.1,
  });

  scrollRail(tl, q(el, ".product-rail"), at + 0.15, 1.2);
}

function revealGallery({ tl }, el, at) {
  blurIn(tl, qa(el, ".gallery-copy"), at, { duration: 0.5 });

  blurIn(tl, qa(el, ".gallery-image"), at + 0.05, {
    y: 28,
    blur: 8,
    duration: 0.6,
  });
}

function revealContact({ tl, setHeader }, el, at) {
  reveal(
    tl,
    qa(el, ".contact-line"),
    { yPercent: 110 },
    { yPercent: 0, duration: 0.7, stagger: 0.14, ease: "power3.out" },
    at,
  );

  blurIn(tl, qa(el, ".contact-detail"), at + 0.4, { duration: 0.5 });

  reveal(
    tl,
    q(el, ".contact-image"),
    { scale: 1.08, autoAlpha: 0 },
    { scale: 1, autoAlpha: 1, duration: 0.8 },
    at + 0.4,
  );

  const footer = q(el, ".home-final-footer");

  if (footer) {
    const footerAt = tl.duration() + SCENE_GAP;

    tl.fromTo(
      footer,
      { yPercent: 100 },
      { yPercent: 0, duration: ENTER },
      footerAt,
    );

    setHeader("dark", footerAt + ENTER * HEADER_FLIP_AT);
  }
}

/* ------------------------------ scene list --------------------------- */
const SCENES = [
  { selector: ".home-about-scene", theme: "light", reveal: revealAbout },
  { selector: ".home-feature-scene", theme: "light", reveal: revealFeature },
  { selector: ".home-brand-scene", theme: "light", reveal: revealBrand },
  {
    selector: ".home-collections-scene",
    theme: "light",
    reveal: revealCollections,
  },
  { selector: ".home-showcase-scene", theme: "dark", reveal: revealShowcase },
  {
    selector: ".home-product-rail-scene",
    theme: "light",
    reveal: revealProductRail,
  },
  { selector: ".home-gallery-scene", theme: "light", reveal: revealGallery },
  { selector: ".home-contact-scene", theme: "light", reveal: revealContact },
];

/* ------------------------------ builder ------------------------------ */
export function buildHomeTimeline(stage) {
  const hero = q(stage, ".home-hero-scene");

  if (!hero) {
    console.warn("[home timeline] .home-hero-scene not found");
    return null;
  }

  const header = q(stage, ".home-header");
  const heroDarken = q(hero, ".home-hero-darken");

  const overview = q(stage, ".home-collage-overview");
  const collageHero = q(overview, '[data-collage-panel="hero"]');
  const collageAbout = q(overview, '[data-collage-panel="about"]');
  const collageFeatured = q(overview, '[data-collage-panel="featured"]');
  const collageGallery = q(overview, '[data-collage-panel="gallery"]');

  const scenes = SCENES.map((scene) => ({
    ...scene,
    el: q(stage, scene.selector),
  })).filter((scene) => {
    if (!scene.el) {
      console.warn(`[home timeline] ${scene.selector} not found, skipped`);
    }

    return Boolean(scene.el);
  });

  if (!scenes.length) return null;

  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

  let theme = "dark";

  const setHeader = (next, at) => {
    if (!header || next === theme) return;

    theme = next;
    tl.to(header, { ...HEADER_THEMES[next], duration: 0.25 }, at);
  };

  // Keep later scenes hidden until their turn in the timeline.
  gsap.set(
    scenes.map((scene) => scene.el),
    { autoAlpha: 0 },
  );

  const ctx = { tl, setHeader };
  let previous = hero;
  let t = 0;

  if (overview && collageHero) {
    const getHeroOverviewTransform = () => {
      const stageBounds = stage.getBoundingClientRect();
      const panelBounds = collageHero.getBoundingClientRect();

      return {
        x:
          panelBounds.left +
          panelBounds.width / 2 -
          (stageBounds.left + stageBounds.width / 2),
        y:
          panelBounds.top +
          panelBounds.height / 2 -
          (stageBounds.top + stageBounds.height / 2),
        scale: Math.min(
          panelBounds.width / stageBounds.width,
          panelBounds.height / stageBounds.height,
        ),
      };
    };

    // Position the real hero over the empty collage hero slot initially.
    gsap.set(hero, {
      ...getHeroOverviewTransform(),
      transformOrigin: "center center",
    });

    const zoomDuration = 1;

    if (collageAbout) {
      tl.to(
        collageAbout,
        {
          xPercent: -125,
          yPercent: 45,
          scale: 0.84,
          autoAlpha: 0,
          duration: zoomDuration,
          ease: "power3.in",
        },
        0,
      );
    }

    if (collageFeatured) {
      tl.to(
        collageFeatured,
        {
          xPercent: 125,
          yPercent: -45,
          scale: 0.84,
          autoAlpha: 0,
          duration: zoomDuration,
          ease: "power3.in",
        },
        0,
      );
    }

    if (collageGallery) {
      tl.to(
        collageGallery,
        {
          xPercent: 115,
          yPercent: 115,
          scale: 0.84,
          autoAlpha: 0,
          duration: zoomDuration,
          ease: "power3.in",
        },
        0,
      );
    }

    // The same hero component grows from its collage position to the stage.
    tl.to(
      hero,
      {
        x: 0,
        y: 0,
        scale: 1,
        duration: zoomDuration,
        ease: "power3.inOut",
      },
      0,
    );

    // The real hero is a sibling of the overview, so it remains visible.
    tl.to(
      overview,
      {
        autoAlpha: 0,
        duration: 0.25,
        ease: "power1.out",
      },
      zoomDuration - 0.2,
    );

    t = zoomDuration + 0.2;
  }

  scenes.forEach((scene, index) => {
    const { el } = scene;

    tl.set(el, { autoAlpha: 1 }, Math.max(t, 0.001));

    if (index === 0) {
      tl.fromTo(
        el,
        { scale: 0.88, yPercent: 8, autoAlpha: 0 },
        {
          scale: 1,
          yPercent: 0,
          autoAlpha: 1,
          duration: ENTER,
          ease: "power3.out",
        },
        t,
      );

      tl.to(
        previous,
        {
          scale: 0.92,
          yPercent: -7,
          autoAlpha: 0.42,
          duration: ENTER,
          ease: "power2.inOut",
        },
        t,
      );

      if (heroDarken) {
        tl.to(heroDarken, { opacity: 0.4, duration: ENTER }, t);
      }
    } else {
      tl.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: ENTER }, t);
      tl.to(previous, { ...RECEDE, duration: ENTER }, t);
    }

    tl.set(previous, { autoAlpha: 0 }, t + ENTER);

    setHeader(scene.theme, t + ENTER * HEADER_FLIP_AT);
    scene.reveal?.(ctx, el, t + ENTER * REVEAL_AT);

    previous = el;
    t = tl.duration() + SCENE_GAP;
  });

  tl.to({}, { duration: SCENE_GAP }, tl.duration());

  return tl;
}
