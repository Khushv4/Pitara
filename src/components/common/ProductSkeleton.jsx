function ProductSkeleton() {
  return (
    <div
      className="
      animate-pulse
      bg-white
      rounded-3xl
      overflow-hidden
    "
    >
      <div className="aspect-[4/5] bg-gray-200" />

      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-3" />

        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export default ProductSkeleton;