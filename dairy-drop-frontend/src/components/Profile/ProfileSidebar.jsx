import { Lock, LogOut, MapPin, Package, UserRound } from "lucide-react"

export const ProfileSidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const menu = [
        { id: 'profile', label: 'Profile', icon: UserRound },
        { id: 'orders', label: 'Orders', icon: Package },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'password', label: 'Security', icon: Lock },
        { id: 'logout', label: 'Logout', icon: LogOut, danger: true },
    ]

    return (
        <aside className='h-screen bg-white border-r px-6 py-8'>
            <div className='mb-10'>
                <h2 className='text-xl font-semibold'>My Account</h2>
                <p className='text-sm text-gray-500'>Manage your profile</p>
            </div>

            <nav className='space-y-1'>
                {menu.map((item) => {
                    const Icon = item.icon
                    const active = activeTab === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() =>
                                item.id === 'logout'
                                    ? onLogout()
                                    : setActiveTab(item.id)
                            }
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                                ${item.danger
                                    ? 'text-red-600 hover:bg-red-200 bg-red-100'
                                    : active
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </button>
                    )
                })}
            </nav>
        </aside>
    )
}