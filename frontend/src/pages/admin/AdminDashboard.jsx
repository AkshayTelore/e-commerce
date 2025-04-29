import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Product Schema
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be positive"),
  description: z.string().optional(),
  image: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Product image is required"),
  category: z.string().min(1, "Category is required"),
});

// Category Schema
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export default function AdminDashboard() {
  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    formState: { errors: productErrors },
    reset: resetProductForm,
  } = useForm({ resolver: zodResolver(productSchema) });

  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    formState: { errors: categoryErrors },
    reset: resetCategoryForm,
  } = useForm({ resolver: zodResolver(categorySchema) });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to fetch categories!");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/products`);
        setProducts(response.data);
      } catch (error) {
        toast.error("Failed to fetch products!");
      }
    };
    fetchProducts();
  }, []);

  const onProductSubmit = async (data) => {
    setLoading(true);
    const file = data.image[0];
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description || "");
    formData.append("image", file);
    formData.append("categoryId", data.category);

    try {
      const response = await axios.post(`${backendUrl}/api/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProducts((prev) => [...prev, response.data]);
      resetProductForm();
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  const onCategorySubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/categories`, {
        name: data.name,
      });
      setCategories((prev) => [...prev, response.data]);
      resetCategoryForm();
      toast.success("Category added successfully!");
    } catch (error) {
      toast.error("Failed to add category!");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product!");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete category!");
    }
  };

  return (
    <div className="w-full h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-full bg-white-100 rounded-xl shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <h1 className="text-2xl text-indigo-900 font-semibold p-4">Admin Dashboard</h1>

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-gray-400 opacity-50 flex items-center justify-center z-50">
            <div className="text-white text-xl">Loading...</div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Form */}
            <div className="border p-6 rounded-lg shadow flex flex-col bg-gray-300 text-black">
              <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
              <form onSubmit={handleSubmitProduct(onProductSubmit)} className="flex flex-col gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Product Name"
                  {...registerProduct("name")}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {productErrors.name && (
                  <p className="text-red-500 text-sm">{productErrors.name.message}</p>
                )}

                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  {...registerProduct("price", { valueAsNumber: true })}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {productErrors.price && (
                  <p className="text-red-500 text-sm">{productErrors.price.message}</p>
                )}

                <textarea
                  placeholder="Description (optional)"
                  {...registerProduct("description")}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                ></textarea>

                <input
                  type="file"
                  {...registerProduct("image")}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {productErrors.image && (
                  <p className="text-red-500 text-sm">{productErrors.image.message}</p>
                )}

                {/* Category Dropdown */}
                <select
                  {...registerProduct("category")}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {productErrors.category && (
                  <p className="text-red-500 text-sm">{productErrors.category.message}</p>
                )}

                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 rounded-md shadow-md hover:from-green-600 hover:to-teal-700 transition-all duration-200 ease-in-out"
                >
                  Add Product
                </button>
              </form>

              {/* Product List */}
              <div className="overflow-y-auto max-h-64">
                <h3 className="text-xl font-semibold mb-2">Products:</h3>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border p-4 mb-2 rounded flex justify-between items-center bg-gray-50 text-black"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <p className="font-bold">{product.name}</p>
                        <p>${product.price}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:underline transition-all duration-200 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Form */}
            <div className="border p-6 rounded-lg shadow flex flex-col bg-gray-300   text-black">
              <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>
              <form onSubmit={handleSubmitCategory(onCategorySubmit)} className="flex flex-col gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Category Name"
                  {...registerCategory("name")}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                />
                {categoryErrors.name && (
                  <p className="text-red-500 text-sm">{categoryErrors.name.message}</p>
                )}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 rounded-md shadow-md hover:from-green-600 hover:to-teal-700 transition-all duration-200 ease-in-out"
                >
                  Add Category
                </button>
              </form>

              {/* Category List */}
              <div className="overflow-y-auto max-h-64">
                <h3 className="text-xl font-semibold mb-2">Categories:</h3>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="border p-4 mb-2 rounded flex justify-between items-center bg-gray-50 text-black"
                  >
                    <p>{category.name}</p>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-600 hover:underline transition-all duration-200 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
