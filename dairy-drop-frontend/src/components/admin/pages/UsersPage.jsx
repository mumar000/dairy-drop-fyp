import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Trash2, Shield } from "lucide-react"
import Loader from "../Loader"

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [newRole, setNewRole] = useState("user")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

      const response = await fetch(`${baseUrl}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      toast.error("Failed to load users")
      console.error("Users error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

      const response = await fetch(`${baseUrl}/api/users/${selectedUser._id}/role`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) throw new Error("Update failed")

      fetchUsers()
      setShowRoleModal(false)
      setSelectedUser(null)
      toast.success("User role updated successfully")
    } catch (error) {
      toast.error("Failed to update user role")
      console.error("Update error:", error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

      const response = await fetch(`${baseUrl}/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Delete failed")

      setUsers(users.filter((u) => u._id !== userId))
      toast.success("User deleted successfully")
    } catch (error) {
      toast.error("Failed to delete user")
      console.error("Delete error:", error)
    }
  }

  if (loading) {
    return <Loader text={"Loading Users"} />
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Users Management</h2>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Joined</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-3 font-medium text-gray-800">{user.name}</td>
                <td className="px-6 py-3 text-gray-600">{user.email}</td>
                <td className="px-6 py-3 text-gray-600">{user.phone || "N/A"}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setNewRole(user.role)
                        setShowRoleModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Change role"
                    >
                      <Shield size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg">
          <p className="text-gray-500">No users found</p>
        </div>
      )}

      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Update User Role</h3>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                User: <strong>{selectedUser.name}</strong>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRoleModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage