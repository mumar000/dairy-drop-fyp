import { Edit3, Loader2, Save } from "lucide-react"
import { Button } from "./Button"
import { Section } from "./Section"
import { useEffect, useState } from "react"
import { useMeQuery, useUpdateProfileMutation } from "../../api/authApi"
import { toast } from "sonner"

export const ProfileInfo = () => {
    const [edit, setEdit] = useState(false)
    const { data: userData } = useMeQuery()

    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    })

    useEffect(() => {
        if (userData?.user) {
            setFormData({
                name: userData.user.name,
                email: userData.user.email,
                phone: userData.user.phone
            })
        }
    }, [userData])

    const handleProfileUpdate = async () => {
        if (edit) {
            try {
                await updateProfile(formData).unwrap()
                toast.success("Profile updated successfully!")
                setEdit(false)
            } catch (error) {
                console.log(error)
                toast.error(error?.data?.message || "Failed to update profile")
            }
        } else {
            setEdit(true)
        }
    }

    return (
        <Section
            title='Personal Information'
            desc='Update your personal details'
            action={
                <Button onClick={handleProfileUpdate} disabled={isUpdating} className="disabled:cursor-not-allowed opacity-100 flex items-center gap-2 font-normal bg-transparent hover:bg-[#F3F4F6] transition-all duration-300 border px-4 py-1.5 rounded-xl"
                >
                    {isUpdating ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : edit ? (
                        <Save size={16} />
                    ) : (
                        <Edit3 size={16} />
                    )}

                    {isUpdating ? ' Saving...' : (edit ? ' Save Profile' : ' Edit Profile')}
                </Button>
            }
        >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {Object.entries(formData).map(([key, value]) => (
                    <div key={key}>
                        <label className='text-xs uppercase text-gray-500'>
                            {key}
                        </label>
                        <input
                            disabled={!edit || isUpdating}
                            value={value}
                            onChange={(e) =>
                                setFormData({ ...formData, [key]: e.target.value })
                            }
                            className='mt-2 w-full border-b pb-2 outline-none disabled:bg-transparent disabled:cursor-not-allowed'
                        />
                    </div>
                ))}
            </div>
        </Section>
    )
}