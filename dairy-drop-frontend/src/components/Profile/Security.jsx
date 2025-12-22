import { useState } from "react"
import { Section } from "./Section"
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react"
import { Button } from "./Button"
import { useChangePasswordMutation } from "../../api/authApi"
import { toast } from "sonner"

export const Security = () => {
    const [show, setShow] = useState(false)
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: ''
    })
    const [changePassword, { isLoading }] = useChangePasswordMutation()

    const handleChangePassword = async () => {
        if (!formData.oldPassword || !formData.newPassword) {
            toast.error("Please fill in all fields")
            return
        }

        if (formData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters")
            return
        }

        try {
            await changePassword(formData).unwrap()
            toast.success("Password updated successfully!")
            setFormData({ oldPassword: '', newPassword: '' })
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update password")
        }
    }

    return (
        <Section title='Security' desc='Change your password'>
            <div className='space-y-6 max-w-full'>
                {[
                    { label: 'Current Password', key: 'oldPassword' },
                    { label: 'New Password', key: 'newPassword' }
                ].map(({ label, key }) => (
                    <div key={label} className='relative'>
                        <label className='text-xs uppercase text-gray-500'>
                            {label}
                        </label>
                        <input
                            type={show ? 'text' : 'password'}
                            value={formData[key]}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            className='w-full border-b mt-2 pb-2 outline-none'
                        />
                        <button
                            type='button'
                            onClick={() => setShow(!show)}
                            className='absolute right-0 top-7 text-gray-400'
                        >
                            {show ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                ))}

                <Button onClick={handleChangePassword} disabled={isLoading} className="disabled:cursor-not-allowed opacity-100 flex items-center gap-2 font-normal bg-transparent hover:bg-[#F3F4F6] transition-all duration-300 border px-4 py-1.5 rounded-xl">
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <Lock size={16} />
                    )}
                    {isLoading ? ' Updating...' : ' Update Password'}
                </Button>
            </div>
        </Section>
    )
}