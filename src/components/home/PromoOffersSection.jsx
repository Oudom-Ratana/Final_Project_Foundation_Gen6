import { Link } from "react-router";
import {
  GraduationCap,
  Users,
  CreditCard,
  Gift,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import ScrollReveal from "../common/ScrollReveal";

const PROMO_DEALS = [
  {
    id: "student",
    title: "Student Wednesday 50% OFF",
    badge: "WEEKLY SPECIAL",
    badgeColor: "bg-red-500 text-white",
    discount: "50% OFF",
    description:
      "Present your valid Student ID at any FilmZone counter or verify online to get half-price tickets every Wednesday.",
    icon: GraduationCap,
    gradient: "from-[#B90101] to-[#730000]",
    linkText: "Claim Student Deal",
  },
  {
    id: "family",
    title: "Family Sunday Blockbuster Pass",
    badge: "WEEKEND PASS",
    badgeColor: "bg-amber-500 text-white",
    discount: "FREE KIDS",
    description:
      "Buy 2 Adult tickets for any animation or family movie, and get 1 Child ticket plus a Duo Popcorn combo completely free.",
    icon: Users,
    gradient: "from-amber-600 to-amber-800",
    linkText: "View Family Terms",
  },
  {
    id: "bank",
    title: "ABA Pay 15% Instant Cashback",
    badge: "DIGITAL PAY",
    badgeColor: "bg-blue-500 text-white",
    discount: "15% BACK",
    description:
      "Scan to pay with ABA KHQR at FilmZone SenSok, Eden Garden, or Toul Kork to receive 15% instant cashback on ticket orders.",
    icon: CreditCard,
    gradient: "from-blue-700 to-indigo-900",
    linkText: "Check Partner Banks",
  },
  {
    id: "birthday",
    title: "FilmZone VIP Birthday Gift",
    badge: "MEMBER REWARD",
    badgeColor: "bg-purple-500 text-white",
    discount: "FREE TICKET",
    description:
      "Celebrate your special day with us! Registered FilmZone members receive 1 complimentary movie ticket and free popcorn during their birthday month.",
    icon: Gift,
    gradient: "from-purple-700 to-purple-950",
    linkText: "Join VIP Club",
  },
];

export default function PromoOffersSection() {
  return (
    <section className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-1.5 h-6 rounded-full inline-block bg-[#B90101]" />
            <p className="text-xs font-black uppercase tracking-widest text-[#B90101]">
              Exclusive Perks & Deals
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
            Special Offers & Promotions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
            Take advantage of exclusive student discounts, partner cashbacks,
            and weekend family packages.
          </p>
        </div>

        <Link
          to="/promo"
          className="inline-flex items-center gap-2 text-sm font-black text-[#B90101] hover:text-[#900000] dark:text-[#EAB308] dark:hover:text-yellow-400 transition"
        >
          <span>View All Promotions</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {PROMO_DEALS.map((deal, idx) => {
          const Icon = deal.icon;

          return (
            <ScrollReveal
              key={deal.id}
              delay={idx * 100}
              duration={650}
              distance="translate-y-8"
            >
              <div className="group relative rounded-3xl overflow-hidden p-6 text-white shadow-lg flex flex-col justify-between min-h-[300px] transition-transform duration-300 hover:-translate-y-1.5">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${deal.gradient}`}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                {/* Top: Badges and Big Discount */}
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${deal.badgeColor}`}
                    >
                      {deal.badge}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#FFD700] drop-shadow-sm">
                      {deal.discount}
                    </span>
                    <h3 className="text-lg font-black leading-snug mt-1 text-white">
                      {deal.title}
                    </h3>
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed line-clamp-3">
                    {deal.description}
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="relative z-10 pt-4 border-t border-white/15 mt-4">
                  <Link
                    to="/promo"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-white hover:text-[#FFD700] transition"
                  >
                    <span>{deal.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
