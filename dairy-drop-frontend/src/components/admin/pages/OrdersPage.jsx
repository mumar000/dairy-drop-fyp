import { useState } from "react"
import { toast } from "sonner"
import { Eye } from "lucide-react"
import OrderDetailModal from "../OrderDetailModal.jsx"
import Loader from "../Loader.jsx"
import { useGetOrdersQuery } from "../../../api/adminApi.js"

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")

  const { data: orders, isLoading, isError, refetch } = useGetOrdersQuery()

  const getStatusColor = (status) => {
    // Convert status to capitalized format for color mapping
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Confirmed: "bg-blue-100 text-blue-800", // Backend uses "Confirmed" for what frontend calls "Processing"
      Shipped: "bg-purple-100 text-purple-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    }
    return colors[capitalizedStatus] || "bg-gray-100 text-gray-800"
  }

  const ordersList = Array.isArray(orders?.orders) ? orders.orders : []

  // Filter orders based on status, handling both frontend and backend status formats
  const filteredOrders = statusFilter === "all"
    ? ordersList
    : ordersList.filter((order) => {
        // Convert both to lowercase for comparison to handle different formats
        const orderStatusLower = order.status.toLowerCase();
        const filterStatusLower = statusFilter.toLowerCase();

        // Map frontend "processing" to backend "confirmed"
        if (filterStatusLower === "processing") {
          return orderStatusLower === "confirmed";
        }
        return orderStatusLower === filterStatusLower;
      })

  if (isLoading) {
    return <Loader text={"Loading Orders"} />
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Failed to load orders</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Orders</h2>

      <div className="mb-6 flex gap-2">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter.toLowerCase() === status.toLowerCase() ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Order ID</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Total</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-3 font-mono text-sm text-gray-600">{order._id.slice(0, 8)}...</td>
                <td className="px-6 py-3">{order?.address?.name || "Unknown"}</td>
                <td className="px-6 py-3 font-bold text-gray-800">${order.totalAmount?.toFixed(2)}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}

      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} refetch={refetch} />}
    </div>
  )
}

export default OrdersPage