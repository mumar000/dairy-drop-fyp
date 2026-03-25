import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal.jsx";
import {
  useUpdateOrderStatusMutation,
  useApproveRefundRequestMutation,
  useRejectRefundRequestMutation,
} from "../../api/adminApi.js";

const OrderDetailModal = ({ order, onClose, refetch }) => {
  const [status, setStatus] = useState(order.status);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [refundNote, setRefundNote] = useState("");

  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const [approveRefundRequest, { isLoading: isApprovingRefund }] =
    useApproveRefundRequestMutation();
  const [rejectRefundRequest, { isLoading: isRejectingRefund }] =
    useRejectRefundRequestMutation();

  const handleStatusUpdate = async () => {
    try {
      // Map frontend status to backend status
      let backendStatus = status;
      if (status === "processing") {
        backendStatus = "Confirmed"; // Backend uses 'Confirmed' for processing
      } else {
        // Capitalize first letter for other statuses
        backendStatus = status.charAt(0).toUpperCase() + status.slice(1);
      }

      await updateOrderStatus({
        id: order._id,
        status: backendStatus,
      }).unwrap();
      toast.success("Order status updated successfully");
      if (refetch) refetch();
      onClose();
    } catch (error) {
      toast.error("Failed to update order status");
      console.error("Error:", error);
    }
  };

  const handleApproveRefund = async () => {
    try {
      await approveRefundRequest({
        id: order._id,
        note: refundNote,
      }).unwrap();
      toast.success("Refund approved successfully");
      if (refetch) refetch();
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve refund");
    }
  };

  const handleRejectRefund = async () => {
    try {
      await rejectRefundRequest({
        id: order._id,
        note: refundNote,
      }).unwrap();
      toast.success("Refund request rejected");
      if (refetch) refetch();
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject refund request");
    }
  };

  const handleStatusClick = () => {
    setShowStatusModal(true);
  };

  const isRefundActionLoading = isApprovingRefund || isRejectingRefund;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono font-bold">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-bold">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Customer</p>
            <p className="font-bold">{order.user?.name || order.address?.name}</p>
            <p className="text-gray-600">{order.user?.email || "No email available"}</p>
            <p className="text-gray-600">{order.user?.phone || order.address?.phone}</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-3">Items</h4>
            <div className="space-y-2 bg-gray-50 p-3 rounded">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${(order.totalAmount - (order.tax || 0)).toFixed(2)}</span>
            </div>
            {order.tax && (
              <div className="flex justify-between mb-2">
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t-2 border-indigo-200 pt-2">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {order.paymentStatus === "RefundRequested" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Review Note
              </label>
              <textarea
                value={refundNote}
                onChange={(e) => setRefundNote(e.target.value)}
                placeholder="Add an optional note for the customer"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Refund reason: {order.refundReason || "requested_by_customer"}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading || isRefundActionLoading}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition disabled:opacity-50"
            >
              Close
            </button>

            {order.paymentMethod === "Stripe" &&
              order.paymentStatus === "RefundRequested" && (
                <>
                  <button
                    onClick={handleRejectRefund}
                    disabled={isLoading || isRefundActionLoading}
                    className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition disabled:opacity-50"
                  >
                    {isRejectingRefund ? "Rejecting..." : "Reject Request"}
                  </button>
                  <button
                    onClick={handleApproveRefund}
                    disabled={isLoading || isRefundActionLoading}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
                  >
                    {isApprovingRefund ? "Approving..." : "Approve Refund"}
                  </button>
                </>
              )}

            <button
              onClick={handleStatusClick}
              disabled={isLoading || isRefundActionLoading || status === order.status}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleStatusUpdate}
        title="Update Order Status"
        message={`Are you sure you want to update the status to ${status}? This action cannot be undone.`}
        confirmText="Update"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </div>
  );
};

export default OrderDetailModal;
