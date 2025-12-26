import { useEffect, useState } from "react"
import { toast } from "sonner"
import StatCard from "../StatCard.jsx"
import { ShoppingCart, Package, Users, TrendingUp } from "lucide-react"
import Loader from "../Loader.jsx"

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

      const totalRevenue = ordersData.orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0

      setStats({
        totalOrders: ordersData.orders?.length || 0,
        totalProducts: productsData.items?.length || 0,
        totalUsers: usersData.users?.length || 0,
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
    return <Loader text={"Loading Dashboard"}/>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={ShoppingCart} title="Total Orders" value={stats.totalOrders} color="blue" />
        <StatCard icon={Package} title="Total Products" value={stats.totalProducts} color="green" />
        <StatCard icon={Users} title="Total Users" value={stats.totalUsers} color="purple" />
        <StatCard icon={TrendingUp} title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} color="orange" />
      </div>

      <div className="bg-white border border-gray-300 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">
          Quick Stats
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Average Order Value
            </p>
            <p className="mt-2 text-2xl font-semibold text-blue-600">
              ${(stats.totalOrders > 0
                ? stats.totalRevenue / stats.totalOrders
                : 0
              ).toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border border-green-100 bg-green-50/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Active Products
            </p>
            <p className="mt-2 text-2xl font-semibold text-green-600">
              {stats.totalProducts}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DashboardHome