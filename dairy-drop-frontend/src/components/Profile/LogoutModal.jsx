import { LogOut } from "lucide-react"
import { Button } from "./Button"

export const LogoutModal = ({ onConfirm, onCancel }) => {
    return (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
            <div className='bg-white rounded-2xl p-8 w-full max-w-sm'>
                <h3 className='text-xl font-semibold mb-2'>Confirm Logout</h3>
                <p className='text-sm text-gray-500 mb-6'>
                    Are you sure you want to logout?
                </p>

                <div className='flex justify-end gap-3'>
                    <Button variant='secondary' onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant='danger' onClick={onConfirm}>
                        <LogOut size={16} />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    )
}