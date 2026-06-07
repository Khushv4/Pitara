function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">
              Image
            </th>

            <th className="text-left p-4">
              Product
            </th>

            <th className="text-left p-4">
              Price
            </th>

            <th className="text-left p-4">
              Featured
            </th>

            <th className="text-left p-4">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b"
            >
              <td className="p-4">
                <img
                  src={product.images?.[0]}
                  alt=""
                  className="
                  w-16
                  h-16
                  rounded-xl
                  object-cover
                "
                />
              </td>

              <td className="p-4">
                {product.title}
              </td>

              <td className="p-4">
                {product.show_price
                  ? `₹${product.price}`
                  : `Starting ₹${product.starting_price}`}
              </td>

              <td className="p-4">
                {product.featured
                  ? "Yes"
                  : "No"}
              </td>

              <td className="p-4 flex gap-2">
                <button
                  onClick={() =>
                    onEdit(product)
                  }
                  className="
                  px-4
                  py-2
                  rounded-lg
                  bg-blue-100
                "
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    onDelete(product.id)
                  }
                  className="
                  px-4
                  py-2
                  rounded-lg
                  bg-red-100
                "
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;