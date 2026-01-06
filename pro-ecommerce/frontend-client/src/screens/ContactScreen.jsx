import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    console.log(formData);
    setSubmitted(true);
    // Reset after 3 seconds for demo purposes
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 5000);
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Page Heading */}
      <h1 className="mb-8 text-3xl font-bold text-slate-800">Contact Us</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* LEFT COLUMN: Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Get in Touch
            </h2>
            <p className="leading-relaxed text-gray-600">
              Have a question about the latest gadget? Need help with your
              order? Fill out the form and our tech experts will get back to you
              within 24 hours.
            </p>
          </div>

          <div className="space-y-6">
            {/* Address Card */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Our Location
                </h3>
                <p className="mt-1 text-gray-600">
                  123 Tech Avenue, Silicon Valley
                  <br />
                  San Francisco, CA 94105
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Email Us
                </h3>
                <p className="mt-1 text-gray-600">support@proshop.com</p>
                <p className="text-gray-600">sales@proshop.com</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Call Us
                </h3>
                <p className="mt-1 text-gray-600">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500">Mon-Fri from 8am to 5pm</p>
              </div>
            </div>
          </div>

          {/* Business Hours Box */}
          <div className="p-6 border border-gray-100 bg-gray-50 rounded-xl">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 mr-2 text-slate-700" />
              <h3 className="text-lg font-semibold text-slate-800">
                Business Hours
              </h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-medium text-gray-900">
                  9:00 AM - 6:00 PM
                </span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="font-medium text-gray-900">
                  10:00 AM - 4:00 PM
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-medium text-red-500">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contact Form */}
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Send a Message
          </h2>

          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center animate-in fade-in">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Message Sent!
              </h3>
              <p className="text-gray-600">
                Thank you for contacting us. We'll get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 font-medium text-blue-600 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 transition-all bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Returns/Warranty">Returns & Warranty</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 transition-all border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex items-center justify-center w-full px-6 py-3 font-bold text-white transition-colors rounded-lg shadow-sm bg-slate-900 hover:bg-slate-800"
              >
                Send Message
                <Send className="w-4 h-4 ml-2" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactScreen;
