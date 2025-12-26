import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus, Edit2, Trash2 } from "lucide-react"
import ProductForm from "../ProductForm.jsx"
import Loader from "../Loader.jsx"

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

      const response = await fetch(`${baseUrl}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      setProducts(data.items || [])
    } catch (error) {
      toast.error("Failed to load products")
      console.error("Products error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

      const response = await fetch(`${baseUrl}/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Delete failed")

      setProducts(products.filter((p) => p._id !== productId))
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
      console.error("Delete error:", error)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  if (loading) {
    return <Loader text={"Loading Products"} />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>

        <button
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
          className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-all duration-300"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ProductForm product={editingProduct} onClose={handleFormClose} />
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="group bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {product.image && (
              <div className="h-48 overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="p-5 space-y-3">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description?.substring(0, 50)}...
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-indigo-600 font-bold">
                  ${product.price}
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setEditingProduct(product)
                    setShowForm(true)
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-2 rounded-lg transition"
                >
                  <Edit2 size={15} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg transition"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-14 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
