import { useState } from "react"
import { toast } from "sonner"
import { Plus, Edit2, Trash2 } from "lucide-react"
import ProductForm from "../ProductForm.jsx"
import Loader from "../Loader.jsx"
import ConfirmationModal from "../ConfirmationModal.jsx"
import { useGetProductsQuery, useDeleteProductMutation } from "../../../api/adminApi.js"

const ProductsPage = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data: products, isLoading, isError, refetch } = useGetProductsQuery()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  const handleDelete = async () => {
    if (!productToDelete) return

    try {
      await deleteProduct(productToDelete).unwrap()
      toast.success("Product deleted successfully")
      setProductToDelete(null)
      setShowDeleteModal(false)
    } catch (error) {
      toast.error("Failed to delete product")
      console.error("Delete error:", error)
      setShowDeleteModal(false)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  if (isLoading) {
    return <Loader text={"Loading Products"} />
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Failed to load products</div>
  }

  const productsList = Array.isArray(products?.items) ? products.items : []

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
        {productsList.map((product) => (
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
                  onClick={() => {
                    setProductToDelete(product._id)
                    setShowDeleteModal(true)
                  }}
                  disabled={isDeleting}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg transition disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {productsList.length === 0 && (
        <div className="text-center py-14 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No products found</p>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ProductsPage
