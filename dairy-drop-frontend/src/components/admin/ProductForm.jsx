import { useState, useEffect } from "react"
import { toast } from "sonner"
import { X, Loader2, Upload } from "lucide-react"
import { useCreateProductMutation, useUpdateProductMutation } from "../../api/adminApi.js"

const ProductForm = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "milk",
    inStock: "",
    isActive: true,
  })

  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()

  const loading = isCreating || isUpdating

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        inStock: product.inStock || product.stock,
        isActive: product.isActive !== undefined ? product.isActive : true,
      })

      // Set existing images if available
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        setPreviewImages(product.images)
      } else if (product.image) {
        setPreviewImages([product.image])
      }
    } else {
      // Reset form for new product
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "milk",
        inStock: "",
        isActive: true,
      })
      setImages([])
      setPreviewImages([])
    }
  }, [product])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)

    // Create preview URLs for the selected files
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewImages(newPreviewUrls)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Create form data for file upload
      const formPayload = new FormData()
      formPayload.append('name', formData.name)
      formPayload.append('description', formData.description)
      // Append as strings since backend will parse them
      formPayload.append('price', formData.price)
      formPayload.append('category', formData.category)
      formPayload.append('inStock', formData.inStock)
      formPayload.append('isActive', formData.isActive || true)

      // Append images if any
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formPayload.append('images', images[i])
        }
      }

      if (product) {
        // Update existing product - pass the form data in a nested object
        await updateProduct({ id: product._id, _formData: formPayload }).unwrap()
        toast.success("Product updated successfully")
      } else {
        // Create new product
        await createProduct(formPayload).unwrap()
        toast.success("Product created successfully")
      }
      onClose()
    } catch (error) {
      console.error("Error details:", error)
      toast.error(error?.data?.message || "Failed to save product")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 mb-8">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{product ? "Edit Product" : "Add New Product"}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={loading}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                placeholder="$99.99"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="inStock"
                placeholder="100"
                value={formData.inStock}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            >
              <option value="milk">Milk</option>
              <option value="yogurt">Yogurt</option>
              <option value="cheese">Cheese</option>
              <option value="butter">Butter</option>
              <option value="ghee">Ghee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-gray-600">Click to upload images</p>
                  <p className="text-sm text-gray-500">Supports multiple files (JPG, PNG, WEBP)</p>
                </div>
              </label>
            </div>

            {/* Image previews */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {previewImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    {index === 0 && (
                      <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : product ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm