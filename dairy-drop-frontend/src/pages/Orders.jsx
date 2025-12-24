import React, { useState, useEffect } from 'react';
import { Package, CreditCard, Truck, CheckCircle, Clock, XCircle, Eye, Download, Search, Loader2, X } from 'lucide-react';
import { useGetMyOrdersQuery, useCancelOrderMutation } from '../api/orderApi.js';
import { toast } from 'sonner';

const Orders = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });

    const { data, isLoading, isError, refetch } = useGetMyOrdersQuery();
    const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

    const orders = data?.orders || [];

    const statusConfig = {
        delivered: {
            label: 'Delivered',
            color: 'bg-green-100 text-green-700 border-green-200',
            icon: CheckCircle,
            iconColor: 'text-green-600'
        },
        shipped: {
            label: 'Shipped',
            color: 'bg-blue-100 text-blue-700 border-blue-200',
            icon: Truck,
            iconColor: 'text-blue-600'
        },
        confirmed: {
            label: 'Confirmed',
            color: 'bg-blue-100 text-blue-700 border-blue-200',
            icon: CheckCircle,
            iconColor: 'text-blue-600'
        },
        pending: {
            label: 'Pending',
            color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            icon: Clock,
            iconColor: 'text-yellow-600'
        },
        processing: {
            label: 'Processing',
            color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            icon: Clock,
            iconColor: 'text-yellow-600'
        },
        cancelled: {
            label: 'Cancelled',
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: XCircle,
            iconColor: 'text-red-600'
        }
    };

    const tabs = [
        { id: 'all', label: 'All Orders', count: orders.length },
        { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
        { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
        { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
        { id: 'Pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
        { id: 'Cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length }
    ];

    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === 'all' || order.status === activeTab;
        const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    const handleCancelOrder = async (orderId) => {
        try {
            await cancelOrder(orderId).unwrap();
            toast.success('Order cancelled successfully');
            setCancelModal({ isOpen: false, orderId: null });
            refetch(); // Refresh the orders list
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error(error?.data?.message || 'Failed to cancel order');
        }
    };

    const openCancelModal = (orderId) => {
        setCancelModal({ isOpen: true, orderId });
    };

    const closeCancelModal = () => {
        setCancelModal({ isOpen: false, orderId: null });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading orders...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">Error loading orders</h2>
                    <p className="text-gray-600">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                            <p className="text-gray-600 mt-1">Track and manage your orders</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-6 py-4 font-medium text-sm transition border-b-2 ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-600">Try adjusting your filters or search query</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
                            const StatusIcon = statusConfig[order.status]?.icon || Clock;
                            return (
                                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                                    {/* Order Header */}
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <p className="text-sm text-gray-600">Order ID</p>
                                                    <p className="font-bold text-gray-900">{order._id}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Date Placed</p>
                                                    <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Total Amount</p>
                                                    <p className="font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                    <StatusIcon className={`w-4 h-4 ${statusConfig[order.status]?.iconColor || 'text-gray-600'}`} />
                                                    {statusConfig[order.status]?.label || order.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                                    <img
                                                        src={item.image || 'https://placehold.co/80x80?text=No+Image'}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span>Qty: {item.quantity}</span>
                                                            <span>•</span>
                                                            <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Details Footer */}
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <div className="flex items-center justify-between flex-wrap gap-4">
                                                <div className="flex items-center gap-6 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-600">Payment:</span>
                                                        <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-600">Status:</span>
                                                        <span className="font-medium text-gray-900 capitalize">{order.status}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {order.status === 'Pending' && (
                                                        <button
                                                            onClick={() => openCancelModal(order._id)}
                                                            disabled={isCancelling}
                                                            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm font-medium">
                                                        <Eye className="w-4 h-4" />
                                                        View Details
                                                    </button>
                                                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm font-medium">
                                                        <Download className="w-4 h-4" />
                                                        Invoice
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Cancel Order Modal */}
                {cancelModal.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
                                <button
                                    onClick={closeCancelModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-gray-600 mb-6">
                                Are you sure you want to cancel this order? This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={closeCancelModal}
                                    disabled={isCancelling}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={() => handleCancelOrder(cancelModal.orderId)}
                                    disabled={isCancelling}
                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isCancelling ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Cancelling...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-4 h-4" />
                                            Yes, Cancel Order
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;