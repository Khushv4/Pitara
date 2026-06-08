function ProductCardSkeleton() {
  return (
    <div className="flex flex-col border border-transparent bg-white w-full">
      
      {/* Fake Image Box */}
      <div className="aspect-square bg-[#EFEBE4] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#EAE3D5] animate-pulse"></div>
      </div>

      {/* Fake Text & Buttons */}
      <div className="p-5 flex flex-col flex-grow gap-3">
        {/* Fake Title */}
        <div className="h-5 bg-[#EAE3D5] rounded animate-pulse w-3/4"></div>
        {/* Fake Price */}
        <div className="h-4 bg-[#EAE3D5] rounded animate-pulse w-1/3"></div>
      </div>

      {/* Fake Buttons */}
      <div className="p-5 pt-0 mt-auto flex flex-col lg:flex-row gap-2">
        <div className="flex-1 h-10 bg-[#EAE3D5] rounded animate-pulse"></div>
        <div className="flex-1 h-10 bg-[#EAE3D5] rounded animate-pulse"></div>
      </div>
      
    </div>
  );
}

export default ProductCardSkeleton;