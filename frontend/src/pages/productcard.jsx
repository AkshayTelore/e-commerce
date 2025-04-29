import { FaPlus } from "react-icons/fa"; // Import the plus icon

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-64">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-80 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-indigo-700">{product.name}</h2>
        {/* Show product category instead of description */}
        <p className="text-gray-600">{product.category}</p>
        <p className="mt-2 text-indigo-500 font-semibold">
          ${product.price.toFixed(2)}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="mt-4 w-12 h-12 bg-purple-600 text-indigo font-semibold rounded-lg hover:bg-purple-700 transition duration-200 flex items-center justify-center"
        >
          <FaPlus className="text-indigo" /> {/* Plus icon */}
        </button>
      </div>
    </div>
  );
}
