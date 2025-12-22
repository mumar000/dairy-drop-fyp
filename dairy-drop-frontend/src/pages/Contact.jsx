import { useState } from 'react'
import Footer from '../components/Footer'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        query: '',
        message: ''
    })

    const [successMsg, setSuccessMsg] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log('Form submitted:', formData)

        // ✅ Show success message
        setSuccessMsg(
            'We have received your query. Our team will get back to you shortly.'
        )

        // ✅ Reset form fields
        setFormData({
            name: '',
            email: '',
            query: '',
            message: ''
        })

        // ✅ Auto hide message after 4 seconds
        setTimeout(() => {
            setSuccessMsg('')
        }, 4000)
    }

    return (
        <>
            <section className='bg-gray-50 py-20 min-h-screen'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

                    {/* Header */}
                    <div className='text-center mb-16'>
                        <span className='inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4'>
                            Get In Touch
                        </span>
                        <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                            Contact <span className='text-blue-600'>Us</span>
                        </h1>
                        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                            Have a question or need assistance? We're here to help. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className='grid md:grid-cols-2 gap-12 max-w-7xl mx-auto'>


                        {/* Contact Info */}
                        <div className='space-y-8'>
                            <div>
                                <h2 className='text-2xl font-bold text-gray-900 mb-6'>Let's Talk</h2>
                                <p className='text-gray-600 mb-8'>
                                    Our customer support team is available to answer your questions and provide assistance with your orders.
                                </p>
                            </div>

                            {/* Contact Cards */}
                            <div className='space-y-4'>
                                {/* Email Card */}
                                <div className='bg-white rounded-xl p-6 border border-blue-200 hover:border-blue-600 transition-colors'>
                                    <div className='flex items-start gap-4'>
                                        <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                            <svg className='w-6 h-6 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                                                <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                                                <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className='font-semibold text-gray-900 mb-1'>Email</h3>
                                            <p className='text-gray-600 text-sm'>support@dairydrop.com</p>
                                            <p className='text-gray-600 text-sm'>orders@dairydrop.com</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Phone Card */}
                                <div className='bg-white rounded-xl p-6 border border-green-200 hover:border-green-500 transition-colors'>
                                    <div className='flex items-start gap-4'>
                                        <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                            <svg className='w-6 h-6 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                                                <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className='font-semibold text-gray-900 mb-1'>Phone</h3>
                                            <p className='text-gray-600 text-sm'>Customer Service: (555) 123-4567</p>
                                            <p className='text-gray-600 text-sm'>Mon-Fri: 8AM - 8PM</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Card */}
                                <div className='bg-white rounded-xl p-6 border border-yellow-200 hover:border-yellow-500 transition-colors'>
                                    <div className='flex items-start gap-4'>
                                        <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                            <svg className='w-6 h-6 text-yellow-600' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className='font-semibold text-gray-900 mb-1'>Office</h3>
                                            <p className='text-gray-600 text-sm'>123 Dairy Lane</p>
                                            <p className='text-gray-600 text-sm'>Fresh Valley, CA 90210</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Link */}
                            <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white'>
                                <h3 className='font-bold text-lg mb-2'>Quick Answers</h3>
                                <p className='text-blue-100 text-sm mb-4'>
                                    Check our FAQ section for instant answers to common questions about orders, delivery, and products.
                                </p>
                                <button className='px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors'>
                                    View FAQ
                                </button>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className='bg-white rounded-2xl p-8 shadow-md border border-gray-200'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                                Send Us a Message
                            </h2>

                            <form onSubmit={handleSubmit} className='space-y-6'>

                                {/* Name */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        Full Name *
                                    </label>
                                    <input
                                        type='text'
                                        name='name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                                        placeholder='John Doe'
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        Email Address *
                                    </label>
                                    <input
                                        type='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                                        placeholder='john@example.com'
                                    />
                                </div>

                                {/* Query */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        Query Type *
                                    </label>
                                    <select
                                        name='query'
                                        value={formData.query}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white'
                                    >
                                        <option value=''>Select a query type</option>
                                        <option value='order'>Order Status & Tracking</option>
                                        <option value='product'>Product Information</option>
                                        <option value='delivery'>Delivery & Shipping</option>
                                        <option value='payment'>Payment & Billing</option>
                                        <option value='return'>Returns & Refunds</option>
                                        <option value='account'>Account Issues</option>
                                        <option value='feedback'>Feedback & Suggestions</option>
                                        <option value='other'>Other</option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        Message *
                                    </label>
                                    <textarea
                                        name='message'
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows='5'
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none'
                                        placeholder='Please provide details about your inquiry...'
                                    />
                                </div>

                                {/* ✅ Success Message */}
                                {successMsg && (
                                    <div className='rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm font-medium'>
                                        {successMsg}
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type='submit'
                                    className='w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg'
                                >
                                    Send Message
                                </button>

                                <p className='text-xs text-gray-500 text-center'>
                                    We typically respond within 24 hours on business days.
                                </p>

                            </form>
                        </div>

                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default Contact
