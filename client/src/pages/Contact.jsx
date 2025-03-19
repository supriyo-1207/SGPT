import React, { useState } from 'react'
import Title from '../components/CommonComponents/Title'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitMessage('Thank you for contacting SGPT support! We will respond to your inquiry within 24-48 hours.')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Title titleName="Contact SGPT Support" />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-lg text-white">
          <h1 className="text-3xl font-bold mb-2">Need Help With SGPT?</h1>
          <p className="text-lg">Our team is here to assist you with any questions or technical support</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-b-lg shadow-lg">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="mb-6">
              Whether you're having technical issues, want to suggest a feature, or have questions about SGPT, we're here to help!
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-gray-600">support@sgpt.ai</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-gray-600">Available Monday-Friday, 9AM-5PM EST</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Documentation</h3>
                  <p className="text-gray-600">Visit our <a href="#" className="text-blue-600 hover:underline">knowledge base</a> for guides and FAQs</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold mb-2">Response Time</h3>
              <p>We typically respond to all inquiries within 24-48 hours during business days.</p>
            </div>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
              
              {submitMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                  {submitMessage}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a topic</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Account Issues">Account Issues</option>
                  <option value="Billing Question">Billing Question</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 mb-2">Describe Your Issue</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide as much detail as possible..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {isSubmitting ? 'Sending...' : 'Submit Support Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact