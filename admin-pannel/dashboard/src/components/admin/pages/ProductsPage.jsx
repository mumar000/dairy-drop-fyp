import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus, Edit2, Trash2 } from "lucide-react"
import ProductForm from "../ProductForm.jsx"

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
      setProducts(data.data || [])
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
    return <div className="text-center py-10">Loading products...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Products</h2>
        <button
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {showForm && <ProductForm product={editingProduct} onClose={handleFormClose} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            {product.image && (
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.description?.substring(0, 50)}...</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-indigo-600 font-bold">${product.price}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.category}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product)
                    setShowForm(true)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-2 rounded-lg transition"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  )
}

export default ProductsPage