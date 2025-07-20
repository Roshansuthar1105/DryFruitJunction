// src/components/contact.jsx
import { use, useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle, Factory } from "lucide-react";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
export default function Contact() {
  const { BACKEND_API, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: `${user?.firstName} ${user?.lastName}`, email: user?.email }));
    }
  }, [user]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND_API}/api/contact`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      if (response.status === 201) {
        toast.success("Response Sent Successfully");
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          subject: 'general'
        });
      }
    } catch (err) {
      toast.error("Failed to send response");
      setError(err.response?.data?.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Contact{" "}
            <span className="bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
              DryFruit Junction
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our dry fruit sweets or want to place a custom order? Get in touch with our team in Jodhpur.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Our Office</h3>
                  <p className="text-gray-600">
                    Omni Ecomm Services Pvt Ltd
                    <br />
                    Santosh Bhawan, Gehloto Ka Bas
                    <br />
                    Magra Poonjala, Jodhpur, Rajasthan
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Factory className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Manufacturing Facility</h3>
                  <p className="text-gray-600">
                    Hotel Omni Plaza, B2
                    <br />
                    Maan Ji Ka Hattha, Paota
                    <br />
                    Jodhpur, Rajasthan
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Call Us</h3>
                  <p className="text-gray-600">
                    Pooran Singh Gehlot
                    <br />
                    +91-9116009307
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Email Us</h3>
                  <p className="text-gray-600">
                    hello@dryfruitjunction.com
                    <br />
                    orders@dryfruitjunction.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Business Hours</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Monday - Sunday: 8:00 AM - 8:00 PM</p>
                    <p>Fresh sweets made after every order</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-pink-50/20 to-orange-50/20 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>

            {submitSuccess ? (
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h4>
                <p className="text-gray-600">
                  Thank you for contacting us. We'll get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-4 cursor-pointer text-pink-600 hover:text-pink-800 font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your name"
                      disabled={user?.firstName}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                      required
                      disabled={user?.email}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                    Phone No.
                  </label>
                  <input
                    type="number"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ex. 9876543210"
                    required
                    disabled={user?.phone}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="cursor-pointer w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  >
                    <option className='cursor-pointer' value="general">General Inquiry</option>
                    <option className='cursor-pointer' value="custom-order">Custom Order</option>
                    <option className='cursor-pointer' value="catering">Catering Services</option>
                    <option className='cursor-pointer' value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us about your sweet needs..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}