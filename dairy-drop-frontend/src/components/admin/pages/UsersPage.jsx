import { useState } from "react"
import { toast } from "sonner"
import { Trash2, Shield } from "lucide-react"
import Loader from "../Loader.jsx"
import ConfirmationModal from "../ConfirmationModal.jsx"
import { useGetUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from "../../../api/adminApi.js"

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [newRole, setNewRole] = useState("user")
  const [userToDelete, setUserToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data: users, isLoading, isError, refetch } = useGetUsersQuery()
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const handleUpdateRole = async () => {
    try {
      await updateUserRole({ id: selectedUser._id, role: newRole }).unwrap()
      setShowRoleModal(false)
      setSelectedUser(null)
      toast.success("User role updated successfully")
    } catch (error) {
      toast.error("Failed to update user role")
      console.error("Update error:", error)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(userToDelete).unwrap()
      toast.success("User deleted successfully")
      setUserToDelete(null)
      setShowDeleteModal(false)
    } catch (error) {
      toast.error("Failed to delete user")
      console.error("Delete error:", error)
      setShowDeleteModal(false)
    }
  }

  if (isLoading) {
    return <Loader text={"Loading Users"} />
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Failed to load users</div>
  }

  const usersList = Array.isArray(users?.users) ? users.users : []

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
            {usersList.map((user) => (
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
                      onClick={() => {
                        setUserToDelete(user._id)
                        setShowDeleteModal(true)
                      }}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
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

      {usersList.length === 0 && (
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
                disabled={isUpdatingRole}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
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
                disabled={isUpdatingRole}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={isUpdatingRole}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition disabled:opacity-50"
              >
                {isUpdatingRole ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default UsersPage