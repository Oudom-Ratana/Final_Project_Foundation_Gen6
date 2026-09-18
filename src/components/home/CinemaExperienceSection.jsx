import { Armchair, Maximize, Users, Tv } from "lucide-react";
import ScrollReveal from "../common/ScrollReveal";

const EXPERIENCES = [
  {
    id: "screenx",
    tag: "270° PANORAMIC",
    title: "ScreenX Experience",
    subtitle: "Beyond the Conventional Screen",
    description:
      "Multi-projection technology that expands selected movie sequences onto the left and right auditorium walls for an unforgettable 270-degree viewing experience.",
    icon: Maximize,
    badgeColor: "bg-red-500/10 text-red-500 border-red-500/20",
    features: [
      "270-Degree Immersion",
      "Dual-Wing Visuals",
      "Specialized Mastering",
    ],
    ctaText: "Explore Auditorium",
    link: "/movies",
  },
  {
    id: "vip",
    tag: "FIRST CLASS LUXURY",
    title: "VIP Luxury Lounge",
    subtitle: "Unmatched Cinema Comfort",
    description:
      "Premium motorized leather recliners with USB charging, complimentary gourmet popcorn & beverages, and exclusive access to the private FilmZone VIP Lounge.",
    icon: Armchair,
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    features: [
      "Motorized Full Recliner",
      "Butler Dine-in Service",
      "Private VIP Lounge",
    ],
    ctaText: "Explore VIP Club",
    link: "/about",
  },
  {
    id: "group_booking",
    tag: "GROUP & CORPORATE",
    title: "Group Booking",
    subtitle: "Private Screenings & Events",
    description:
      "Host corporate seminars, private birthday screenings, school excursions, or gaming parties with customized snacks, private auditorium rental, and dedicated support.",
    icon: Users,
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    features: [
      "Private Hall Rental",
      "Custom Snack Combos",
      "Bulk Ticket Discounts",
    ],
    ctaText: "Inquire Group Rates",
    link: "/about",
  },
  {
    id: "stream_movie",
    tag: "ONLINE STREAMING",
    title: "Stream Movie",
    subtitle: "Watch Blockbusters Anywhere",
    description:
      "Enjoy top trending movies, series, and exclusive cinema titles directly on your phone, tablet, or smart TV with seamless high-definition streaming playback.",
    icon: Tv,
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    features: [
      "Instant HD Streaming",
      "Multi-Device Sync",
      "Exclusive Series & Shows",
    ],
    ctaText: "Start Streaming Now",
    link: "/stream",
  },
];

export default function CinemaExperienceSection() {
  return (
    <section className="space-y-8 font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-1.5 h-6 rounded-full inline-block bg-[#B90101]" />
            <p className="text-xs font-black uppercase tracking-widest text-[#B90101]">
              Next-Gen Entertainment
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
            The FilmZone Experience
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
            Immerse yourself in panoramic auditoriums, VIP luxury lounges,
            private group screenings, and instant online movie streaming.
          </p>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {EXPERIENCES.map((exp, idx) => {
          const Icon = exp.icon;

          return (
            <ScrollReveal
              key={exp.id}
              delay={idx * 100}
              duration={600}
              distance="translate-y-8"
            >
              <div className="group relative rounded-3xl p-6 transition-all duration-500 overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#12161C] text-neutral-900 dark:text-white hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(185,1,1,0.3)] flex flex-col justify-between min-h-[300px] h-full select-none">
                {/* 1. Traveling Red Border on Hover (All 4 Edges) */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#B90101] transition-colors duration-300 pointer-events-none z-20" />

                {/* Top Edge Red Sweep Line */}
                <span className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#B90101] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center z-30" />

                {/* Bottom Edge Red Sweep Line */}
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#B90101] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center z-30 delay-75" />

                {/* Left Edge Red Sweep Line */}
                <span className="absolute top-0 bottom-0 left-0 w-[2.5px] bg-gradient-to-b from-transparent via-[#B90101] to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center z-30 delay-100" />

                {/* Right Edge Red Sweep Line */}
                <span className="absolute top-0 bottom-0 right-0 w-[2.5px] bg-gradient-to-b from-transparent via-[#B90101] to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center z-30 delay-100" />

                {/* 2. Soft Ambient Cinema Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#B90101]/[0.08] via-transparent to-[#FFD700]/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

                {/* 3. Card Content */}
                <div className="relative z-10 space-y-4">
                  {/* Tag & Animated Icon Row */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${exp.badgeColor} group-hover:scale-105 transition-transform duration-300`}
                    >
                      {exp.tag}
                    </span>

                    {/* Icon container bounces & turns FilmZone Red on hover */}
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 group-hover:bg-[#B90101] group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-[#B90101]/30 flex items-center justify-center transition-all duration-300">
                      <Icon className="w-6 h-6 text-[#B90101] group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-white group-hover:text-[#B90101] transition-colors duration-200">
                      {exp.title}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-400 mt-0.5">
                      {exp.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {exp.description}
                  </p>
                </div>

                {/* Subtle bottom indicator line (non-clickable, pure show) */}
                <div className="relative z-10 pt-4 mt-auto">
                  <div className="h-1 w-8 rounded-full bg-neutral-200 dark:bg-white/10 group-hover:w-16 group-hover:bg-[#B90101] transition-all duration-500" />
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
