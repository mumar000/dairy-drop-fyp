import { useSelector } from "react-redux"
import { Bell } from "lucide-react"

const AdminHeader = () => {
  const userInfo = useSelector((state) => state.auth.userInfo)

  return (
    <div className="bg-white shadow-sm   p-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Create | Manage | Analyze</h1>
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            {userInfo?.user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{userInfo?.user?.name || "Admin"}</p>
            <p className="text-xs text-gray-500">{userInfo?.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHeader