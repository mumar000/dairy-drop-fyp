export const Section = ({ title, desc, action, children }) => (
    <div className='bg-white rounded-2xl border p-8'>
        <div className='flex justify-between items-start mb-8'>
            <div>
                <h3 className='text-xl font-semibold'>{title}</h3>
                <p className='text-sm text-gray-500 mt-1'>{desc}</p>
            </div>
            {action}
        </div>
        {children}
    </div>
)