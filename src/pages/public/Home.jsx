import SEO from "../../components/common/SEO";
import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/sections/Hero";
import FeaturedProducts from "../../components/sections/FeaturedProducts";
import ProductsFeed from "../../components/sections/ProductsFeed";
import Footer from "../../components/layout/Footer";

function Home() {
  return (
    <>
      <SEO
        title="Pitara | Premium Gift Hampers & Collectibles"
        description="Discover curated gift hampers, anime merchandise, and personalized gifts."
      />

      {/* CHANGED: Added flex flex-col to guarantee layout structure */}
      <main className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Navbar />
        <Hero />
        <FeaturedProducts />
        <ProductsFeed />
        <Footer />
      </main>
    </>
  );
}

export default Home;