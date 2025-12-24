import { Pencil, Plus, Trash2, X } from "lucide-react"
import { Button } from "./Button"
import { Section } from "./Section"
import { useMeQuery, useUpdateAddressMutation, useDeleteAddressMutation } from '../../api/authApi.js'
import { toast } from 'sonner'
import { useState } from "react"

export const Addresses = () => {
    const { data, isLoading, isError, refetch } = useMeQuery()
    const [updateAddress] = useUpdateAddressMutation()
    const [deleteAddress] = useDeleteAddressMutation()
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, addressId: null })

    const user = data?.user || {}
    const addresses = user.addresses || []

    const handleSetDefault = async (addressId) => {
        try {
            // First, unset the current default address
            const currentDefault = addresses.find(addr => addr.isDefault);
            if (currentDefault && currentDefault._id !== addressId) {
                await updateAddress({
                    id: currentDefault._id,
                    isDefault: false
                }).unwrap();
            }

            // Then, set the new address as default
            await updateAddress({
                id: addressId,
                isDefault: true
            }).unwrap();

            toast.success('Default address updated successfully')
            refetch()
        } catch (error) {
            console.error('Error updating default address:', error)
            toast.error('Failed to update default address')
        }
    }

    const handleDeleteAddress = async () => {
        try {
            await deleteAddress(deleteModal.addressId).unwrap()
            toast.success('Address deleted successfully')
            setDeleteModal({ isOpen: false, addressId: null })
            refetch()
        } catch (error) {
            console.error('Error deleting address:', error)
            toast.error('Failed to delete address')
        }
    }

    const openDeleteModal = (addressId) => {
        setDeleteModal({ isOpen: true, addressId })
    }

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, addressId: null })
    }

    if (isLoading) {
        return (
            <Section
                title='Saved Addresses'
                desc='Manage delivery locations'
                action={
                    <Button variant='secondary'>
                        <Plus size={16} />
                        Add Address
                    </Button>
                }
            >
                <div className='flex justify-center items-center h-32'>
                    <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
                </div>
            </Section>
        )
    }

    if (isError) {
        return (
            <Section
                title='Saved Addresses'
                desc='Manage delivery locations'
                action={
                    <Button variant='secondary'>
                        <Plus size={16} />
                        Add Address
                    </Button>
                }
            >
                <div className='text-center py-8 text-red-600'>
                    <p>Error loading addresses. Please try again later.</p>
                </div>
            </Section>
        )
    }

    return (
        <Section
            title='Saved Addresses'
            desc='Manage delivery locations'
            action={
                <Button variant='secondary'>
                    <Plus size={16} />
                    Add Address
                </Button>
            }
        >
            <div className='space-y-4'>
                {addresses.length === 0 ? (
                    <div className='text-center py-8'>
                        <p className='text-gray-600'>No addresses found</p>
                    </div>
                ) : (
                    addresses.map((address) => (
                        <div
                            key={address._id}
                            className='flex justify-between items-center border rounded-xl p-4'
                        >
                            <div>
                                <p className='font-medium'>
                                    {address.line1} {address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state}, {address.postalCode}, {address.country}
                                </p>
                                {address.isDefault && (
                                    <span className='text-xs text-green-600'>
                                        Default
                                    </span>
                                )}
                            </div>

                            <div className='flex gap-2'>
                                {!address.isDefault && (
                                    <Button
                                        variant='secondary'
                                        onClick={() => handleSetDefault(address._id)}
                                    >
                                        Set Default
                                    </Button>
                                )}
                                <Button variant='secondary'>
                                    <Pencil size={14} />
                                </Button>
                                <Button
                                    variant='danger'
                                    onClick={() => openDeleteModal(address._id)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Address Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Delete Address</h3>
                            <button
                                onClick={closeDeleteModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this address? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAddress}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition font-medium"
                            >
                                Delete Address
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Section>
    )
}