import { Section } from "./Section"
import { useGetMyOrdersQuery } from '../../api/orderApi.js'
import { Loader2 } from 'lucide-react'

const statusStyles = {
    Delivered: 'bg-green-100 text-green-700',
    Shipped: 'bg-blue-100 text-blue-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Processing: 'bg-yellow-100 text-yellow-700',
    Cancelled: 'bg-red-100 text-red-700',
}

export const Orders = () => {
    const { data, isLoading, isError } = useGetMyOrdersQuery()

    if (isLoading) {
        return (
            <Section title='Order History' desc='Track your orders'>
                <div className='flex justify-center items-center h-32'>
                    <Loader2 className='w-6 h-6 animate-spin' />
                </div>
            </Section>
        )
    }

    if (isError) {
        return (
            <Section title='Order History' desc='Track your orders'>
                <div className='text-center py-8 text-red-600'>
                    <p>Error loading orders. Please try again later.</p>
                </div>
            </Section>
        )
    }

    const orders = data?.orders || []

    return (
        <Section title='Order History' desc='Track your orders'>
            <div className='space-y-4'>
                {orders.length === 0 ? (
                    <div className='text-center py-8'>
                        <p className='text-gray-600'>No orders found</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className='flex justify-between items-center p-4 border rounded-xl'
                        >
                            <div>
                                <p className='font-medium'>{order._id}</p>
                                <p className='text-xs text-gray-500'>
                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${order.totalAmount.toFixed(2)}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}
                            >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </Section>
    )
}