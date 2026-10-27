import { Link } from "react-router";

const fallbackImages = [
  "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
];

function getImageUrl(product, fallback) {
  const image = product?.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;

  return fallback;
}

function getProductPath(product) {
  const productId = product?._id ?? product?.id;
  return productId ? `/products/${productId}` : "/CatalogPage";
}

function formatPrice(product) {
  if (!product?.price) return "";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: product.price.currency || "INR",
  }).format(product.price.amountInPaise / 100);
}

export default function HomeCollageOverview({ products = [] }) {
  const featuredProduct = products[0];
  const secondaryProduct = products[1] ?? products[0];
  const galleryProducts = products.slice(0, 3);

  return (
    <section
      className="home-collage-overview"
      aria-label="Commonform home page overview"
    >
      <div className="home-collage-grid">
        {/* The real HeroScene animates from this collage slot. */}
        <div
          className="home-collage-panel home-collage-hero home-collage-hero-slot"
          data-collage-panel="hero"
          aria-hidden="true"
        />

        <Link
          to="/CatalogPage"
          className="home-collage-panel home-collage-about"
          data-collage-panel="about"
        >
          <div className="home-collage-about-copy">
            <p className="home-collage-eyebrow">Our point of view</p>
            <h2>
              Thoughtful objects,
              <br />
              made for everyday life.
            </h2>
            <span>Discover the collection ↗</span>
          </div>

          <img
            src={getImageUrl(secondaryProduct, fallbackImages[0])}
            alt={secondaryProduct?.name || "A Commonform product"}
          />
        </Link>

        <Link
          to={getProductPath(featuredProduct)}
          className="home-collage-panel home-collage-featured"
          data-collage-panel="featured"
        >
          <img
            src={getImageUrl(featuredProduct, fallbackImages[1])}
            alt={featuredProduct?.name || "Featured product"}
          />

          <div className="home-collage-featured-copy">
            <p className="home-collage-eyebrow">A considered favorite</p>
            <h2>{featuredProduct?.name || "Made for daily rituals"}</h2>
            {featuredProduct && <p>{formatPrice(featuredProduct)}</p>}
          </div>
        </Link>

        <Link
          to="/CatalogPage"
          className="home-collage-panel home-collage-gallery"
          data-collage-panel="gallery"
        >
          <div>
            <p className="home-collage-eyebrow">The collection</p>
            <h2>
              Pieces to
              <br />
              live with.
            </h2>
          </div>

          <div className="home-collage-thumbnails">
            {(galleryProducts.length ? galleryProducts : [null]).map(
              (product, index) => (
                <img
                  key={product?._id ?? product?.id ?? index}
                  src={getImageUrl(
                    product,
                    fallbackImages[index % fallbackImages.length],
                  )}
                  alt={product?.name || ""}
                />
              ),
            )}
          </div>
        </Link>
      </div>
    </section>
  );
}
