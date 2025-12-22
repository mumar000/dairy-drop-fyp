import { useState } from 'react'
import { ProfileSidebar } from '../components/Profile/ProfileSidebar'
import { ProfileInfo } from '../components/Profile/ProfileInfo'
import { Orders } from "../components/Profile/Orders"
import { Addresses } from "../components/Profile/Addresses"
import { Security } from "../components/Profile/Security"
import { LogoutModal } from '../components/Profile/LogoutModal'
import { logout } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const [tab, setTab] = useState('profile')
    const [showLogout, setShowLogout] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout());
        navigate("/")
    }

    return (
        <div className='h-screen grid grid-cols-[280px_1fr] bg-gray-50'>
            <ProfileSidebar
                activeTab={tab}
                setActiveTab={setTab}
                onLogout={() => setShowLogout(true)}
            />

            <main className='overflow-y-auto p-10'>
                <div className='max-w-5xl mx-auto space-y-8'>
                    {tab === 'profile' && <ProfileInfo />}
                    {tab === 'orders' && <Orders />}
                    {tab === 'addresses' && <Addresses />}
                    {tab === 'password' && <Security />}
                </div>
            </main>

            {showLogout && (
                <LogoutModal
                    onCancel={() => setShowLogout(false)}
                    onConfirm={handleLogout}
                />
            )}
        </div>
    )
}

export default Profile
