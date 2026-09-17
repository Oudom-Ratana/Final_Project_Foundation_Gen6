import {
  Smartphone,
  QrCode,
  Ticket,
  Popcorn,
  Star,
  Bell,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ScrollReveal from "../common/ScrollReveal";
import logoImg from "../../assets/logo/FilmZoneLogo.png";

const VIP_FEATURES = [
  {
    icon: Ticket,
    title: "Instant Digital E-Tickets",
    desc: "Scan and walk straight to your cinema hall with zero waiting in line.",
  },
  {
    icon: Popcorn,
    title: "Pre-order Concessions",
    desc: "Order popcorn & drinks from your seat; ready for pickup before showtime.",
  },
  {
    icon: Star,
    title: "Earn VIP Rewards",
    desc: "Get 10% reward points on every dollar spent towards free movie tickets.",
  },
  {
    icon: Bell,
    title: "Early Pre-sale Access",
    desc: "Book premiere seats 48 hours before general release for blockbusters.",
  },
];

export default function MobileAppSection() {
  return (
    <section className="font-sans">
      <ScrollReveal duration={750} distance="translate-y-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border border-neutral-800 shadow-2xl p-6 sm:p-10 lg:p-14">
          {/* Decorative ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#B90101]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Info & Features (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B90101]/20 border border-[#B90101]/40 text-[#FFD700] text-xs font-black uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>FilmZone VIP Club & Mobile App</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Experience Cinema Faster With Our Mobile App
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl">
                  Transform how you watch movies. Select your favorite seats on
                  our live interactive seat map, order fresh caramel popcorn in
                  advance, and gain exclusive VIP rewards.
                </p>
              </div>

              {/* 4 Feature Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {VIP_FEATURES.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-start gap-3 hover:border-neutral-700 transition"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#B90101]/20 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#FFD700]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Download CTA + QR Code */}
              <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center gap-6">
                <div className="flex flex-wrap gap-3">
                  {/* Apple App Store */}
                  <a
                    href="#download"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 transition shadow-md group"
                  >
                    <svg
                      className="w-6 h-6 shrink-0 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.56-.69.95-1.64.84-2.6-.82.04-1.83.56-2.41 1.25-.52.6-.98 1.58-.86 2.5.92.07 1.87-.49 2.43-1.15z" />
                    </svg>
                    <div className="text-left leading-tight">
                      <div className="text-[9px] uppercase tracking-wider font-bold text-neutral-500">
                        Download on the
                      </div>
                      <div className="text-xs font-black text-neutral-900">
                        App Store
                      </div>
                    </div>
                  </a>

                  {/* Google Play */}
                  <a
                    href="#download"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition shadow-md group"
                  >
                    <svg
                      className="w-5 h-5 shrink-0 fill-current text-[#FFD700]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 20.5v-17c0-.86.97-1.35 1.66-.86l14.28 8.5c.67.4.67 1.33 0 1.73L4.66 21.36c-.69.49-1.66 0-1.66-.86z" />
                    </svg>
                    <div className="text-left leading-tight">
                      <div className="text-[9px] uppercase tracking-wider font-bold text-neutral-400">
                        GET IT ON
                      </div>
                      <div className="text-xs font-black text-white">
                        Google Play
                      </div>
                    </div>
                  </a>
                </div>

                {/* QR Code preview */}
                <div className="flex items-center gap-3 bg-neutral-900/90 border border-neutral-800 px-3 py-2 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shrink-0">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-black text-white uppercase tracking-wider">
                      Scan to Download
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      iOS & Android supported
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Phone Mockup & Digital Ticket Preview (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px]">
                {/* Background Card - FilmZone VIP Card */}
                <div className="absolute -top-5 -left-4 right-4 h-48 rounded-3xl bg-gradient-to-r from-[#B90101] via-[#900000] to-neutral-900 p-5 text-white shadow-xl rotate-[-3deg] border border-white/20">
                  <div className="flex items-center justify-between">
                    <img
                      src={logoImg}
                      alt="FilmZone"
                      className="h-6 object-contain brightness-0 invert"
                    />
                    <span className="text-[10px] font-black tracking-widest text-[#FFD700] uppercase bg-black/40 px-2.5 py-0.5 rounded-full">
                      VIP ELITE
                    </span>
                  </div>
                  <div className="mt-6">
                    <p className="text-[10px] text-white/70 uppercase tracking-wider">
                      Member Name
                    </p>
                    <p className="text-sm font-black tracking-wide">
                      FILMZONE LOYALTY CLUB
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-[#FFD700] font-bold">
                      Points: 2,450 pts
                    </span>
                    <span className="text-white/60">ID: FZ-89201</span>
                  </div>
                </div>

                {/* Foreground Card - Digital Ticket Mockup */}
                <div className="relative z-10 bg-white dark:bg-neutral-900 rounded-3xl p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 translate-y-8">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        CONFIRMED E-TICKET
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">
                      #TK-44910
                    </span>
                  </div>

                  {/* Movie preview details */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#B90101] tracking-wider">
                      ScreenX 270°
                    </span>
                    <h3 className="text-base font-black text-neutral-900 dark:text-white">
                      Avatar: The Way of Water
                    </h3>
                    <p className="text-xs text-neutral-500">
                      FilmZone SenSok • Hall 1 (ScreenX)
                    </p>
                  </div>

                  {/* Seat & Date details */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-center">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-neutral-400">
                        Date
                      </p>
                      <p className="text-xs font-black text-neutral-900 dark:text-white">
                        Today
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-neutral-400">
                        Time
                      </p>
                      <p className="text-xs font-black text-[#B90101] dark:text-[#FFD700]">
                        07:30 PM
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-neutral-400">
                        Seats
                      </p>
                      <p className="text-xs font-black text-neutral-900 dark:text-white">
                        F12, F13
                      </p>
                    </div>
                  </div>

                  {/* Barcode Graphic */}
                  <div className="pt-2 text-center">
                    <div className="h-10 bg-neutral-900 dark:bg-neutral-800 rounded-lg flex items-center justify-center px-4 overflow-hidden">
                      <div className="w-full flex justify-between items-center opacity-80 h-7 space-x-1">
                        {Array.from({ length: 32 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-full bg-white ${
                              i % 3 === 0
                                ? "w-1.5"
                                : i % 2 === 0
                                  ? "w-0.5"
                                  : "w-1"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[9px] font-mono text-neutral-400 mt-1.5 tracking-widest">
                      SHOW THIS CODE AT ENTRANCE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
