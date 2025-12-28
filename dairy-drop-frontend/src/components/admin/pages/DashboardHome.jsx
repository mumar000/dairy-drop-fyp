import { useEffect, useState } from "react"
import { toast } from "sonner"
import StatCard from "../StatCard.jsx"
import { ShoppingCart, Package, Users, TrendingUp } from "lucide-react"
import Loader from "../Loader.jsx"
import { useGetOrdersQuery, useGetProductsQuery, useGetUsersQuery } from "../../../api/adminApi.js"

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })

  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useGetOrdersQuery()
  const { data: products, isLoading: productsLoading, isError: productsError } = useGetProductsQuery()
  const { data: users, isLoading: usersLoading, isError: usersError } = useGetUsersQuery()

  useEffect(() => {
    // Calculate stats when data is available
    const ordersData = orders?.orders || []
    const productsData = products?.items || []
    const usersData = users?.users || []

    const totalRevenue = Array.isArray(ordersData) ? ordersData.reduce((sum, order) => sum + order.totalAmount, 0) : 0

    setStats({
      totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
      totalProducts: Array.isArray(productsData) ? productsData.length : 0,
      totalUsers: Array.isArray(usersData) ? usersData.length : 0,
      totalRevenue,
    })
  }, [orders, products, users])

  // If any data is loading, show loading state
  if (ordersLoading || productsLoading || usersLoading) {
    return <Loader text={"Loading Dashboard"}/>
  }

  // If any request failed, show error
  if (ordersError || productsError || usersError) {
    return <div className="text-center py-10 text-red-500">Failed to load dashboard statistics</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={ShoppingCart} title="Total Orders" value={orders?.orders?.length || 0} color="blue" />
        <StatCard icon={Package} title="Total Products" value={products?.items?.length || 0} color="green" />
        <StatCard icon={Users} title="Total Users" value={users?.users?.length || 0} color="purple" />
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
              {Array.isArray(products?.items) ? products.items.filter((p) => p.inStock > 0).length || 0 : 0}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DashboardHome