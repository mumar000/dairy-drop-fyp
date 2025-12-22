export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className='flex items-center justify-center gap-2 mt-12'>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg font-medium ${currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                Next
            </button>
        </div>
    )
}