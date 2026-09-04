import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactInfo() {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-black/50 border border-neutral-200/90 dark:border-white/10 shadow-lg dark:shadow-2xl space-y-6 flex flex-col justify-between font-sans">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-black text-neutral-900 dark:text-white">
            Contact Information
          </h3>
          <p className="text-[16px] text-neutral-600 dark:text-neutral-400 mt-1">
            Reach out through our official cinema channels.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3.5 text-neutral-700 dark:text-neutral-200">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
              style={{ backgroundColor: '#B90101' }}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Address</h4>
              <p className="text-[16px] font-semibold text-neutral-900 dark:text-white">
                Aeon Mall 1, Samdach Sothearos Blvd, Phnom Penh
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 text-neutral-700 dark:text-neutral-200">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
              style={{ backgroundColor: '#B90101' }}
            >
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Phone</h4>
              <p className="text-[16px] font-semibold text-neutral-900 dark:text-white">
                +855 12 345 678 / +855 23 999 888
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 text-neutral-700 dark:text-neutral-200">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
              style={{ backgroundColor: '#B90101' }}
            >
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Email</h4>
              <p className="text-[16px] font-semibold text-neutral-900 dark:text-white">
                support@flixzone.cinema
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 text-neutral-700 dark:text-neutral-200">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
              style={{ backgroundColor: '#B90101' }}
            >
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Opening Hours</h4>
              <p className="text-[16px] font-semibold text-neutral-900 dark:text-white">
                Mon - Sun: 08:00 AM - 11:30 PM
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-neutral-300 dark:border-white/10 shadow-md aspect-[16/9] relative">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80"
            alt="Phnom Penh Location Map"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 dark:bg-black/40 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-black/90 backdrop-blur-md rounded-full shadow-lg border border-neutral-200 dark:border-white/20">
              <MapPin className="w-4 h-4 text-[#B90101]" />
              <span className="text-[14px] font-bold text-neutral-900 dark:text-white">
                FlixZone Cinema - Phnom Penh
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[13px] text-neutral-500 dark:text-neutral-400 italic text-center pt-2">
        For immediate on-site assistance, please visit the cinema ticket counter.
      </p>
    </div>
  );
}
