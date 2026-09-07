

import { Send, Globe } from 'lucide-react';

export default function MemberCard({ member }) {
  const { name, role, image, telegram, github, portfolio } = member;

  return (
    <div className="relative group p-6 pt-7 pb-6 rounded-[28px] bg-[#EFEFEF] shadow-sm flex flex-col items-center text-center justify-between min-h-[380px] w-full max-w-[260px] mx-auto">
      
      {/* Red Frame Container with Two Dots on Top */}
      <div className="absolute inset-3.5 rounded-2xl border border-[#9E0000] pointer-events-none">
        {/* Top-Left Red Dot */}
        <span className="absolute -top-[5px] left-8 h-2.5 w-2.5 rounded-full bg-[#9E0000]" />
        {/* Top-Right Red Dot */}
        <span className="absolute -top-[5px] right-8 h-2.5 w-2.5 rounded-full bg-[#9E0000]" />
      </div>

      {/* Avatar Photo (Clean Circular Image) */}
      <div className="relative z-10 w-28 h-28 my-1 rounded-full overflow-hidden bg-white shadow-xs">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Name and Role Info Container */}
      <div className="relative z-10 flex flex-col items-center my-auto">
        <h3 className="text-[18px] font-bold text-[#9E0000] tracking-tight mb-2 leading-tight px-2">
          {name}
        </h3>

        {/* Role Pill Badge */}
        <span className="px-5 py-1 rounded-full text-white font-medium text-[12px] capitalize bg-[#9E0000] shadow-xs">
          {role || "Frontend"}
        </span>
      </div>

      {/* Social Media Action Icons */}
      <div className="relative z-10 flex items-center justify-center gap-3 pt-1 mb-1">
        {/* Telegram */}
        <a
          href={telegram || '#'}
          target="_blank"
          rel="noreferrer"
          className="w-7 h-7 rounded-full bg-white text-[#9E0000] hover:bg-[#9E0000] hover:text-white flex items-center justify-center transition-colors shadow-xs"
          aria-label={`${name}'s Telegram`}
        >
          <Send className="w-3.5 h-3.5 -ml-0.5" />
        </a>

        {/* GitHub */}
        <a
          href={github || '#'}
          target="_blank"
          rel="noreferrer"
          className="w-7 h-7 rounded-full bg-white text-[#9E0000] hover:bg-[#9E0000] hover:text-white flex items-center justify-center transition-colors shadow-xs"
          aria-label={`${name}'s GitHub`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>

        {/* Portfolio / Globe */}
        <a
          href={portfolio || '#'}
          target="_blank"
          rel="noreferrer"
          className="w-7 h-7 rounded-full bg-white text-[#9E0000] hover:bg-[#9E0000] hover:text-white flex items-center justify-center transition-colors shadow-xs"
          aria-label={`${name}'s Portfolio`}
        >
          <Globe className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}