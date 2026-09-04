import { Send, Globe } from 'lucide-react';

export default function MemberCard({ member }) {
  const { name, role, image, telegram, github, portfolio } = member;

  return (
    <div className="relative group p-6 rounded-3xl bg-white dark:bg-black/50 border border-neutral-200/90 dark:border-white/10 shadow-md dark:shadow-2xl hover:shadow-xl dark:hover:shadow-red-950/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center">
      {/* 4 Red Corner Bracket Accents matching Figma (┌ ┐ └ ┘) */}
      <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#B90101] rounded-tl pointer-events-none" />
      <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#B90101] rounded-tr pointer-events-none" />
      <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#B90101] rounded-bl pointer-events-none" />
      <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#B90101] rounded-br pointer-events-none" />

      {/* Avatar Photo with Glowing Circular Ring */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4 rounded-full p-1 bg-gradient-to-tr from-[#B90101] via-rose-500 to-blue-500 shadow-md">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-full bg-neutral-100 dark:bg-neutral-800"
          loading="lazy"
        />
      </div>

      {/* Name */}
      <h3 className="text-[20px] font-black text-neutral-900 dark:text-white tracking-tight mb-2 group-hover:text-[#B90101] transition-colors line-clamp-1">
        {name}
      </h3>

      {/* Role Pill Badge */}
      <span
        className="px-4 py-1 rounded-full text-white font-black text-[13px] uppercase tracking-wider mb-4 shadow-sm"
        style={{ backgroundColor: '#B90101' }}
      >
        {role}
      </span>

      {/* 3 Social Media Action Icons */}
      <div className="flex items-center justify-center gap-3 pt-1">
        {/* Telegram */}
        <a
          href={telegram || '#'}
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-[#B90101] hover:text-white dark:hover:bg-[#B90101] flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-all shadow-xs"
          aria-label={`${name}'s Telegram`}
        >
          <Send className="w-3.5 h-3.5 -ml-0.5" />
        </a>

        {/* GitHub */}
        <a
          href={github || '#'}
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-[#B90101] hover:text-white dark:hover:bg-[#B90101] flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-all shadow-xs"
          aria-label={`${name}'s GitHub`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>

        {/* Portfolio / Globe */}
        <a
          href={portfolio || '#'}
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-[#B90101] hover:text-white dark:hover:bg-[#B90101] flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-all shadow-xs"
          aria-label={`${name}'s Portfolio`}
        >
          <Globe className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
