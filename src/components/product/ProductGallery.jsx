import { useState } from "react";

function ProductGallery({ images = [] }) {
  const [selected, setSelected] = useState(
    images[0]
  );

  return (
    <div>
      <div
        className="
        aspect-[4/5]
        overflow-hidden
        rounded-3xl
        bg-white
      "
      >
        <img
          src={selected}
          alt=""
          className="
          w-full
          h-full
          object-cover
        "
        />
      </div>

      <div className="flex gap-3 mt-4 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelected(image)}
            className="
            shrink-0
            w-20
            h-24
            rounded-xl
            overflow-hidden
            border
          "
          >
            <img
              src={image}
              alt=""
              className="
              w-full
              h-full
              object-cover
            "
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;