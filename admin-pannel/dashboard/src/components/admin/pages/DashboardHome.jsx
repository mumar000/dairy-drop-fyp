import { useEffect, useState } from "react"
import { toast } from "sonner"
import StatCard from "../StatCard.jsx"
import { ShoppingCart, Package, Users, TrendingUp } from "lucide-react"

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

      const [ordersRes, productsRes, usersRes] = await Promise.all([
        fetch(`${baseUrl}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const ordersData = await ordersRes.json()
      const productsData = await productsRes.json()
      const usersData = await usersRes.json()

      const totalRevenue = ordersData.data?.reduce((sum, order) => sum + order.total, 0) || 0

      setStats({
        totalOrders: ordersData.data?.length || 0,
        totalProducts: productsData.data?.length || 0,
        totalUsers: usersData.data?.length || 0,
        totalRevenue,
      })
    } catch (error) {
      toast.error("Failed to load dashboard statistics")
      console.error("Stats error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={ShoppingCart} title="Total Orders" value={stats.totalOrders} color="blue" />
        <StatCard icon={Package} title="Total Products" value={stats.totalProducts} color="green" />
        <StatCard icon={Users} title="Total Users" value={stats.totalUsers} color="purple" />
        <StatCard icon={TrendingUp} title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} color="orange" />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Average Order Value</p>
            <p className="text-2xl font-bold text-blue-600">
              ${(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0).toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Active Products</p>
            <p className="text-2xl font-bold text-green-600">{stats.totalProducts}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome