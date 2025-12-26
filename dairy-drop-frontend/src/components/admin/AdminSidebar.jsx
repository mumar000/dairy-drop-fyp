import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logout } from "../../features/auth/authSlice.js"
import { toast } from "sonner"
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu } from "lucide-react"
import { useState } from "react"

const AdminSidebar = ({ currentPage, setCurrentPage }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "users", label: "Users", icon: Users },
  ]

  const handleLogout = () => {
    dispatch(logout())
    toast.success("Logged out successfully")
    navigate("/admin/login")
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg"
      >
        <Menu size={24} />
      </button>

      <div
        className={`fixed lg:relative w-1/2 md:w-1/5 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${isOpen ? "left-0" : "-left-full lg:left-0"
          }`}
      >
        <div className="p-[18px] border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Dairy Drop</h2>
          <p className="text-gray-500 text-sm mt-1">Admin Panel - Manage | Analyze</p>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 text-sm font-medium ${currentPage === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-10 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 text-sm font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        <p className="absolute bottom-2 left-4 right-4 text-center text-xs text-gray-500 font-medium">&copy; 2026 Dairy Drop | Muhamamd Umar</p>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}

export default AdminSidebar