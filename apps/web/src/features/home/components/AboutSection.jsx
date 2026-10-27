import { Link } from "react-router";

const fallbackImages = [
  "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",
];

function getImageUrl(product, fallback) {
  const image = product?.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;

  return fallback;
}

export default function AboutSection({
  largeProduct,
  smallProduct,
  brandLine = "Thoughtful essentials",
  italicLine = "for everyday life.",
  smallNote = "Made for daily rituals",
  paragraphOne = "Useful objects, chosen for their quality and the care in their details.",
  paragraphTwo = "Considered pieces that make everyday moments feel a little more special.",
  buttonLabel = "View the collection",
}) {
  return (
    <section className="home-about-scene absolute inset-0 z-20 grid min-h-[100svh] place-items-center overflow-hidden p-2 sm:p-4 lg:p-5">
      <div className="about-panel relative h-[calc(100svh-1rem)] w-full max-w-[1440px] overflow-hidden rounded-xl border border-white/15 bg-[#f4f6fa] text-[#0a1a33] sm:h-[calc(100svh-2rem)] sm:rounded-2xl">
        <div className="about-copy">
          <h2 className="about-heading">
            <span className="about-heading-mask">
              <span className="about-heading-line about-heading-sans">
                {brandLine}
              </span>
            </span>
            <span className="about-heading-mask">
              <span className="about-heading-line about-heading-serif">
                {italicLine}
              </span>
            </span>
          </h2>

          <p className="about-paragraph">{paragraphOne}</p>
          <p className="about-paragraph">{paragraphTwo}</p>

          <Link to="/CatalogPage" className="about-button">
            {buttonLabel}
          </Link>
        </div>

        <p className="about-note">{smallNote}</p>

        <figure className="about-image about-image-large">
          <img
            src={getImageUrl(largeProduct, fallbackImages[0])}
            alt={largeProduct?.name || "A Commonform product"}
          />
        </figure>

        <figure className="about-image about-image-small">
          <img
            src={getImageUrl(smallProduct, fallbackImages[1])}
            alt={smallProduct?.name || "Another Commonform product"}
          />
        </figure>
      </div>
    </section>
  );
}
