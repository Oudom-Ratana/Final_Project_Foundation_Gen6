import React, { useState, useEffect, useRef } from "react";
import { Armchair, Maximize, Users, Tv } from "lucide-react";
import ScrollReveal from "../common/ScrollReveal";
import TypewriterText from "../common/TypewriterText";

const EXPERIENCES = [
  {
    id: "screenx",
    tag: "270° PANORAMIC",
    title: "ScreenX Experience",
    titlePhrases: [
      "ScreenX Experience",
      "270° Panoramic Screen",
      "Beyond The Screen",
    ],
    subtitle: "Beyond the Conventional Screen",
    description:
      "Multi-projection technology that expands selected movie sequences onto the left and right auditorium walls for an unforgettable 270-degree viewing experience.",
    icon: Maximize,
    side: "left",
    iconBg:
      "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25",
  },
  {
    id: "vip",
    tag: "FIRST CLASS LUXURY",
    title: "VIP Luxury Lounge",
    titlePhrases: [
      "VIP Luxury Lounge",
      "First-Class Comfort",
      "Private VIP Suites",
    ],
    subtitle: "Unmatched Cinema Comfort",
    description:
      "Premium motorized leather recliners with USB charging, complimentary gourmet popcorn & beverages, and exclusive access to the private FilmZone VIP Lounge.",
    icon: Armchair,
    side: "right",
    iconBg:
      "bg-gradient-to-br from-[#FF4D4D] to-[#B90101] text-white shadow-md shadow-red-500/25",
  },
  {
    id: "group_booking",
    tag: "REAL-TIME GROUP",
    title: "Group Booking",
    titlePhrases: ["Group Booking", "Live Seat Selection", "Book With Friends"],
    subtitle: "Live Collaborative Seat Selection",
    description:
      "Book movie tickets together with your friends in real time. Select and reserve your seats simultaneously on a live interactive seating map so everyone sits together seamlessly.",
    icon: Users,
    side: "left",
    iconBg:
      "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md shadow-blue-500/25",
  },
  {
    id: "stream_movie",
    tag: "FREE STREAMING",
    title: "Stream Movie",
    titlePhrases: [
      "Stream Movie",
      "Watch Free Full Movies",
      "Cinema Favorites Online",
    ],
    subtitle: "Watch Free Full Movies Anytime",
    description:
      "Watch free full-length movies provided directly by FilmZone, including movies that have stopped playing in the cinema.",
    icon: Tv,
    side: "right",
    iconBg:
      "bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-md shadow-purple-500/25",
  },
];

function CinemaExperienceCard({ exp, idx, isLeft }) {
  const cardRef = useRef(null);
  const [isShaking, setIsShaking] = useState(false);
  const Icon = exp.icon;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let timer;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsShaking(true);
          clearTimeout(timer);
          timer = setTimeout(() => {
            setIsShaking(false);
          }, 1050);
        } else {
          setIsShaking(false);
        }
      },
      {
        threshold: 0.18,
        rootMargin: "-20px 0px -20px 0px",
      },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-3xl p-6 sm:p-8 transition-all duration-300 ease-out border-2 border-slate-200/90 dark:border-white/15 bg-white dark:bg-[#141518]/95 backdrop-blur-md text-slate-900 dark:text-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_28px_rgba(0,0,0,0.4)] active:scale-[0.99] flex flex-col justify-between select-none cursor-pointer ${
        isShaking ? "animate-card-auto-swing" : ""
      }`}
    >
      {/* Thin Glowing Red Snake Beam Running on the Outside Perimeter on Hover */}
      <svg
        className="absolute -inset-[3px] w-[calc(100%+6px)] h-[calc(100%+6px)] pointer-events-none rounded-[27px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 overflow-visible"
        style={{
          filter:
            "drop-shadow(0 0 3px #B90101) drop-shadow(0 0 6px rgba(185, 1, 1, 0.6))",
        }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`snakeGrad-${exp.id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#B90101" stopOpacity="0" />
            <stop offset="60%" stopColor="#B90101" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#B90101" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Thin Core Primary Red Laser Beam on Outside Perimeter */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="27"
          ry="27"
          fill="none"
          stroke={`url(#snakeGrad-${exp.id})`}
          strokeWidth="2"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="22 78"
          className="animate-snake-around"
        />
      </svg>

      <div className="relative z-10 space-y-4">
        {/* Top Row: Saturated Squircle Icon + Tag with Pulsing Radar Dot */}
        <div className="flex items-center justify-between gap-4">
          {/* Saturated Squircle Icon Box with Gentle Hover Scale */}
          <div
            className={`size-13 sm:size-14 rounded-2xl grid place-items-center shrink-0 transition-transform duration-300 ease-out group-hover:scale-105 ${exp.iconBg}`}
          >
            <Icon className="size-7" />
          </div>

          {/* Category Tag with Pulsing Radar Dot */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10">
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B90101] opacity-75" />
              <span className="relative inline-flex rounded-full size-1.5 bg-[#B90101]" />
            </span>
            {exp.tag}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="pt-1">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight min-h-[2rem] sm:min-h-[2.25rem] flex items-center">
            <TypewriterText
              phrases={exp.titlePhrases || [exp.title]}
              speed={80}
              deleteSpeed={40}
              pauseTime={2500}
              className="font-black"
              cursorClassName="text-[#B90101] dark:text-[#FFD700]"
            />
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[#B90101] dark:text-[#FFD700] mt-0.5">
            {exp.subtitle}
          </p>
        </div>

        {/* Description: Strictly 18px font size with crystal-clear high contrast */}
        <p className="text-[18px] leading-[28px] font-normal text-slate-700 dark:text-slate-200 pt-1">
          {exp.description}
        </p>
      </div>
    </div>
  );
}

export default function CinemaExperienceSection() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll position for subtle streaming along the timeline
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.min(
        Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0),
        1,
      );
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative space-y-10 font-sans select-none py-6"
    >
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-20">
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
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
            <span>Featuring:</span>
            <TypewriterText
              phrases={[
                "270° Panoramic ScreenX Technology",
                "VIP Motorized Leather Recliners",
                "Live Real-Time Group Seat Selection",
                "Free Full Movies & Cinema Exclusives",
              ]}
              className="font-bold text-[#B90101] dark:text-[#FFD700]"
            />
          </div>
        </div>
      </div>

      {/* ── Timeline Canvas: Vertical Timeline with Alternating Cards (Matching Prototype) ── */}
      <div className="relative rounded-3xl p-4 sm:p-6 lg:p-10">
        {/* Soft Ambient Radial Light in Dark Mode */}
        <div className="hidden dark:block absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-[600px] bg-[#B90101]/[0.05] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 size-[600px] bg-[#FFC928]/[0.03] rounded-full blur-3xl" />
        </div>

        {/* ── SLEEK VERTICAL TIMELINE TRACK (SUBTLE & TIGHT GLOW) ── */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 -translate-x-1/2 w-[1.5px] pointer-events-none z-0">
          {/* 1. Subtle Inactive Background Track */}
          <div className="w-full h-full bg-slate-200/80 dark:bg-white/10" />

          {/* 2. Scroll-Driven Active Red Line with Tight Laser Glow */}
          <div
            className="absolute top-0 left-0 w-full bg-[#B90101] rounded-full transition-all duration-150"
            style={{
              height: `${Math.min(Math.max(scrollProgress * 115, 12), 100)}%`,
              boxShadow: "0 0 4px rgba(185, 1, 1, 0.45)",
            }}
          />
        </div>

        {/* ── ALTERNATING CARDS TIMELINE (MATCHING PROTOTYPE) ── */}
        <div className="relative z-10 flex flex-col space-y-12 sm:space-y-16 lg:space-y-20 max-w-6xl mx-auto">
          {EXPERIENCES.map((exp, idx) => {
            const isLeft = exp.side === "left";

            return (
              <div
                key={exp.id}
                className="group/item relative w-full flex items-center"
              >
                {/* Desktop Central Timeline Node (Matching Prototype Image with Subtle Animation) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
                  <div className="relative flex items-center justify-center">
                    {/* Continuous Tight Radar Ripple Wave 1 */}
                    <span className="absolute size-7.5 rounded-full border border-[#B90101] animate-timeline-ripple-1 opacity-60" />
                    {/* Continuous Tight Radar Ripple Wave 2 (Staggered) */}
                    <span className="absolute size-7.5 rounded-full border border-[#B90101] animate-timeline-ripple-2 opacity-60" />

                    {/* Outer Translucent Halo Ring with Subtle Red Glow */}
                    <div className="size-6.5 sm:size-7 rounded-full bg-[#B90101]/10 dark:bg-[#B90101]/25 border border-[#B90101]/35 dark:border-[#B90101]/60 flex items-center justify-center shadow-[0_0_6px_rgba(185,1,1,0.2)] transition-transform duration-300 group-hover/item:scale-110">
                      {/* Middle Crisp Pure White Ring (Pops in Dark Mode) */}
                      <div className="size-4 sm:size-4.5 rounded-full bg-white border border-slate-200/90 dark:border-white shadow-sm dark:shadow-[0_0_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
                        {/* Inner Solid Red Core Dot with Subtle Breathing Glow */}
                        <div className="size-2 sm:size-2.5 rounded-full bg-[#B90101] animate-timeline-core" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Left Timeline Node */}
                <div className="md:hidden absolute left-6 top-10 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute size-6.5 rounded-full border border-[#B90101] animate-timeline-ripple-1 opacity-60" />
                    <div className="size-6 rounded-full bg-[#B90101]/10 dark:bg-[#B90101]/25 border border-[#B90101]/35 dark:border-[#B90101]/60 flex items-center justify-center shadow-[0_0_5px_rgba(185,1,1,0.2)]">
                      <div className="size-4 rounded-full bg-white border border-slate-200/90 dark:border-white shadow-sm dark:shadow-[0_0_6px_rgba(255,255,255,0.5)] flex items-center justify-center">
                        <div className="size-1.5 rounded-full bg-[#B90101] animate-timeline-core" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Container: Placed on Left or Right of the Film Reel */}
                <div
                  className={`w-full pl-12 sm:pl-16 md:pl-0 ${
                    isLeft
                      ? "md:w-[calc(50%-2.5rem)] md:mr-auto"
                      : "md:w-[calc(50%-2.5rem)] md:ml-auto"
                  }`}
                >
                  <ScrollReveal
                    delay={idx * 120}
                    duration={650}
                    distance={isLeft ? "-translate-x-10" : "translate-x-10"}
                    className="w-full"
                  >
                    <CinemaExperienceCard exp={exp} idx={idx} isLeft={isLeft} />
                  </ScrollReveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
