
import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!formData.agree) {
      toast.warning('Please accept the data processing terms.');
      return;
    }

    toast.success('Thank you! Your message has been sent to our cinema team.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      agree: false,
    });
  };

  return (
    <div className="p-8 rounded-2xl bg-[#EFEFEF] dark:bg-black/60 border border-transparent dark:border-white/10 shadow-sm dark:shadow-2xl space-y-6 font-sans">
      <div>
        <h3 className="text-2xl font-bold text-black dark:text-white">
          Send Us a Message
        </h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-400 mt-1">
          Our support team will respond as soon as possible
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-black dark:text-neutral-200 mb-2">
              Full Name <span className="text-[#9E0000] dark:text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ratana Oudom"
              className="w-full px-4 py-2.5 bg-white dark:bg-black/40 border border-transparent dark:border-white/15 rounded-full text-xs text-neutral-700 dark:text-neutral-200 placeholder-neutral-300 dark:placeholder-neutral-500 focus:outline-none focus:border-[#9E0000]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-black dark:text-neutral-200 mb-2">
              Email Address <span className="text-[#9E0000] dark:text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="oudom@example.com"
              className="w-full px-4 py-2.5 bg-white dark:bg-black/40 border border-transparent dark:border-white/15 rounded-full text-xs text-neutral-700 dark:text-neutral-200 placeholder-neutral-300 dark:placeholder-neutral-500 focus:outline-none focus:border-[#9E0000]"
            />
          </div>
        </div>

        {/* Phone & Subject Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-black dark:text-neutral-200 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+855 12 345 678"
              className="w-full px-4 py-2.5 bg-white dark:bg-black/40 border border-transparent dark:border-white/15 rounded-full text-xs text-neutral-700 dark:text-neutral-200 placeholder-neutral-300 dark:placeholder-neutral-500 focus:outline-none focus:border-[#9E0000]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-black dark:text-neutral-200 mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Select a subject"
              className="w-full px-4 py-2.5 bg-white dark:bg-black/40 border border-transparent dark:border-white/15 rounded-full text-xs text-neutral-700 dark:text-neutral-200 placeholder-neutral-300 dark:placeholder-neutral-500 focus:outline-none focus:border-[#9E0000]"
            />
          </div>
        </div>

        {/* Message Textarea */}
        <div>
          <label className="block text-xs font-semibold text-black dark:text-neutral-200 mb-2">
            Message <span className="text-[#9E0000] dark:text-red-500">*</span>
          </label>
          <textarea
            name="message"
            required
            rows="5"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write any message here"
            className="w-full p-4 bg-white dark:bg-black/40 border border-transparent dark:border-white/15 rounded-2xl text-xs text-neutral-700 dark:text-neutral-200 placeholder-neutral-300 dark:placeholder-neutral-500 focus:outline-none focus:border-[#9E0000] resize-none"
          />
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-center gap-2.5 pt-1">
          <input
            type="checkbox"
            id="agree"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="w-3.5 h-3.5 rounded-full accent-[#9E0000] cursor-pointer"
          />
          <label
            htmlFor="agree"
            className="text-[11px] text-neutral-500 dark:text-neutral-400 cursor-pointer select-none"
          >
            I agree that ISTAD AngkorCine may use my information to respond to this request.
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium text-xs bg-[#9E0000] hover:bg-red-800 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </button>
        </div>
      </form>
    </div>
  );
}