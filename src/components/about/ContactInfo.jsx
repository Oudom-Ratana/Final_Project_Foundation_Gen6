

import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactInfo() {
  return (
    <div className="p-8 rounded-2xl bg-[#EFEFEF] space-y-6 flex flex-col justify-between font-sans">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-black">
            Contact Information
          </h3>
        </div>

        <div className="space-y-5">
          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#9E0000] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-black">Address</h4>
              <p className="text-xs text-neutral-500">Phnom Penh</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-[#9E0000] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-black">Phone</h4>
              <p className="text-xs text-neutral-500">+885 12 44 55 66</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-[#9E0000] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-black">Email</h4>
              <p className="text-xs text-neutral-500">angkorcine@gmail.com</p>
            </div>
          </div>

          {/* Working Hour */}
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#9E0000] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-black">Working Hour</h4>
              <p className="text-xs text-neutral-500">Daily, 7:00 AM - 10:00 PM</p>
            </div>
          </div>
        </div>

        {/* Map Preview Image */}
        <div className="rounded-2xl overflow-hidden shadow-sm aspect-[16/9] relative">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80"
            alt="Phnom Penh Location Map"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="border-t border-neutral-300 pt-4">
        <p className="text-[11px] text-neutral-400 text-center">
          For immediate assistance while at the cinema, please visit the ticket counter
        </p>
      </div>
    </div>
  );
}