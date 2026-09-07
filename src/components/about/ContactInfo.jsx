
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import mapImg from '../../assets/mentors_and_member/image01.png';

export default function ContactInfo({ mapImage }) {
  return (
    <div className="p-8 rounded-2xl bg-[#EFEFEF] dark:bg-black/60 border border-transparent dark:border-white/10 shadow-sm dark:shadow-2xl space-y-6 flex flex-col justify-between font-sans transition-colors duration-300">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-black dark:text-white">
            Contact Information
          </h3>
        </div>

        <div className="space-y-5">
          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#9E0000] dark:text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-black dark:text-white">Address</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Phnom Penh</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-[#9E0000] dark:text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-black dark:text-white">Phone</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">+855 12 44 55 66</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-[#9E0000] dark:text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-black dark:text-white">Email</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">angkorcine@gmail.com</p>
            </div>
          </div>

          {/* Working Hour */}
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#9E0000] dark:text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-black dark:text-white">Working Hour</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Daily, 7:00 AM - 10:00 PM</p>
            </div>
          </div>
        </div>

        {/* Map Image Container */}
        <div className="rounded-2xl overflow-hidden border border-neutral-300 dark:border-white/10 shadow-sm aspect-[16/9] relative">
          <img
            src={mapImage || mapImg}
            alt="ISTAD AngkorCine Location Map"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="border-t border-neutral-300 dark:border-white/10 pt-4">
        <p className="text-[11px] text-neutral-400 dark:text-neutral-400 text-center">
          For immediate assistance while at the cinema, please visit the ticket counter
        </p>
      </div>
    </div>
  );
}