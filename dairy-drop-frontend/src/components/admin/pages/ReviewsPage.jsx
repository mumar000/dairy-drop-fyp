import React, { useState } from 'react';
import { useGetAllReviewsQuery, useModerateReviewMutation, useDeleteReviewMutation } from '../../../api/reviewApi';
import { toast } from 'sonner';
import { Star, MessageCircle, User, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Loader from '../Loader';

const ReviewsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: reviewsData, isLoading, isError, refetch } = useGetAllReviewsQuery({ page, limit, searchTerm });
  const [moderateReview] = useModerateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const reviews = reviewsData?.reviews || [];
  const totalReviews = reviewsData?.total || 0;
  const totalPages = Math.ceil(totalReviews / limit);

  const handleModerateReview = async (reviewId, isApproved) => {
    try {
      await moderateReview({ id: reviewId, isApproved }).unwrap();
      toast.success(`Review ${isApproved ? 'approved' : 'rejected'} successfully`);
      refetch();
    } catch (error) {
      toast.error(`Failed to ${isApproved ? 'approve' : 'reject'} review`);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId).unwrap();
      toast.success('Review deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (isLoading) {
      return <Loader text={"Loading Reviews"} />
    }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Reviews Management</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading reviews. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reviews Management</h1>
        <p className="text-gray-600">Manage and moderate user reviews</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Search and Filter Bar */}
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-gray-200">
          {reviews.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No reviews found
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-900">
                          {review.user?.name || 'Anonymous User'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium text-gray-900">{review.rating}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.isApproved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {review.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <p>Product: {review.product?.name || 'Unknown Product'}</p>
                      <p>Created: {new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleModerateReview(review._id, true)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                    )}
                    {review.isApproved && (
                      <button
                        onClick={() => handleModerateReview(review._id, false)}
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalReviews > 0 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalReviews)} of {totalReviews} reviews
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded">
                {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;