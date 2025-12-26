import { useState } from "react"
import AdminSidebar from "../../components/admin/AdminSidebar.jsx"
import AdminHeader from "../../components/admin/AdminHeader.jsx"
import DashboardHome from "../../components/admin/pages/DashboardHome.jsx"
import ProductsPage from "../../components/admin/pages/ProductsPage.jsx"
import OrdersPage from "../../components/admin/pages/OrdersPage.jsx"
import UsersPage from "../../components/admin/pages/UsersPage.jsx"

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardHome />
      case "products":
        return <ProductsPage />
      case "orders":
        return <OrdersPage />
      case "users":
        return <UsersPage />
      default:
        return <DashboardHome />
    }
  }

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      <AdminSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-8">{renderPage()}</main>
      </div>
    </div>
  )
}

export default AdminDashboard