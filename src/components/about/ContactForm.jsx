import { useState } from 'react';
import { Send, User, Mail, Phone, MessageSquare } from 'lucide-react';
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
    <div className="p-8 rounded-3xl bg-white dark:bg-black/50 border border-neutral-200/90 dark:border-white/10 shadow-lg dark:shadow-2xl space-y-6 font-sans">
      <div>
        <h3 className="text-2xl font-black text-neutral-900 dark:text-white">
          Send Us a Message
        </h3>
        <p className="text-[16px] text-neutral-600 dark:text-neutral-400 mt-1">
          Our support team will respond to your request as soon as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[16px] font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ratana Oudom"
                className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-black/60 border border-neutral-300 dark:border-white/15 rounded-2xl text-[16px] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#B90101] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[16px] font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. oudom@example.com"
                className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-black/60 border border-neutral-300 dark:border-white/15 rounded-2xl text-[16px] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#B90101] transition"
              />
            </div>
          </div>
        </div>

        {/* Phone & Subject Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[16px] font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+855 12 345 678"
                className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-black/60 border border-neutral-300 dark:border-white/15 rounded-2xl text-[16px] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#B90101] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[16px] font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
              Subject
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Cinema Tickets / Inquiry"
                className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-black/60 border border-neutral-300 dark:border-white/15 rounded-2xl text-[16px] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#B90101] transition"
              />
            </div>
          </div>
        </div>

        {/* Message Textarea */}
        <div>
          <label className="block text-[16px] font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
            Message *
          </label>
          <textarea
            name="message"
            required
            rows="4"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            className="w-full p-4 bg-neutral-50 dark:bg-black/60 border border-neutral-300 dark:border-white/15 rounded-2xl text-[16px] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#B90101] transition resize-none"
          />
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-center gap-3 pt-1">
          <input
            type="checkbox"
            id="agree"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="w-4 h-4 rounded text-[#B90101] focus:ring-[#B90101] border-neutral-300 dark:border-white/20 bg-neutral-50 dark:bg-black cursor-pointer"
          />
          <label
            htmlFor="agree"
            className="text-[14px] text-neutral-600 dark:text-neutral-400 cursor-pointer select-none"
          >
            I agree that FlixZone Cinema may store and process my contact data.
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white font-black text-[16px] shadow-xl shadow-red-950/40 hover:brightness-110 active:scale-95 transition-all"
            style={{ backgroundColor: '#B90101' }}
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </div>
      </form>
    </div>
  );
}
