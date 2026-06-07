import { useParams } from "react-router-dom";

import useProducts from "../../hooks/useProducts";

import ProductCard from "../../components/product/ProductCard";

function Category() {
  const { slug } = useParams();

  const { products, loading } =
    useProducts();

  const filteredProducts =
    products.filter(
      (product) =>
        product.category_slug === slug
    );

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <section className="py-20 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-6">
        <h1
          className="
          text-5xl
          font-bold
          text-[#1A531A]
          mb-10
        "
        >
          {slug
            .replaceAll("-", " ")
            .toUpperCase()}
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default Category;