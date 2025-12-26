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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg"
      >
        <Menu size={24} />
      </button>

      <div
        className={`fixed lg:relative w-1/4 h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 text-white transition-all duration-300 z-40 ${
          isOpen ? "left-0" : "-left-full lg:left-0"
        }`}
      >
        <div className="p-6 border-b border-indigo-500">
          <h2 className="text-2xl font-bold">Dairy Drop</h2>
          <p className="text-indigo-200 text-sm">Admin Panel</p>
        </div>

        <nav className="p-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                  currentPage === item.id
                    ? "bg-white text-indigo-600 font-semibold"
                    : "text-indigo-100 hover:bg-indigo-500"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}

export default AdminSidebar