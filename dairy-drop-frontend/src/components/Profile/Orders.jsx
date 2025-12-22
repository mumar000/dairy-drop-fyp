import { Section } from "./Section"

const statusStyles = {
    Completed: 'bg-green-100 text-green-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Shipped: 'bg-yellow-100 text-yellow-700',
    Cancelled: 'bg-red-100 text-red-700',
}

export const Orders = () => {
    const orders = [
        { id: '#10231', date: '12 Sep 2024', total: '$120.00', status: 'Completed' },
        { id: '#10232', date: '18 Sep 2024', total: '$89.99', status: 'In Progress' },
        { id: '#10233', date: '21 Sep 2024', total: '$45.50', status: 'Shipped' },
        { id: '#10254', date: '30 Sep 2024', total: '$79.50', status: 'Cancelled' },
    ]

    return (
        <Section title='Order History' desc='Track your orders'>
            <div className='space-y-4'>
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className='flex justify-between items-center p-4 border rounded-xl'
                    >
                        <div>
                            <p className='font-medium'>{order.id}</p>
                            <p className='text-xs text-gray-500'>
                                {order.date} · {order.total}
                            </p>
                        </div>

                        <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyles[order.status]}`}
                        >
                            {order.status}
                        </span>
                    </div>
                ))}
            </div>
        </Section>
    )
}