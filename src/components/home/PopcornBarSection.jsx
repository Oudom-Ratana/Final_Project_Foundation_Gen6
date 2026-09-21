import { Star, Flame, Coffee } from "lucide-react";
import popcornImg from "../../assets/loader/popcorn-bucket1.png";
import ScrollReveal from "../common/ScrollReveal";

const SNACK_COMBOS = [
  {
    id: "combo-1",
    name: "Caramel Supreme Duo",
    tag: "BESTSELLER",
    tagColor: "bg-red-500 text-white",
    description:
      "1 Large Warm Golden Caramel Popcorn + 2 Soft Drinks (Coca-Cola / Sprite)",
    price: "$4.50",
    rating: 4.9,
    kcal: "780 kcal",
  },
  {
    id: "combo-2",
    name: "Ultimate Nacho Feast",
    tag: "SAVORY CRUNCH",
    tagColor: "bg-amber-500 text-white",
    description:
      "Crispy Tortilla Chips with warm melted Cheddar Cheese dip & Jalapeños + 1 Large Drink",
    price: "$5.00",
    rating: 4.8,
    kcal: "620 kcal",
  },
  {
    id: "combo-3",
    name: "Blockbuster VIP Bucket",
    tag: "FAMILY SIZE",
    tagColor: "bg-purple-600 text-white",
    description:
      "XXL Dual-Flavor Popcorn (Sweet & Salty) + 3 Soft Drinks + 1 Milk Chocolate Treat",
    price: "$7.50",
    rating: 5.0,
    kcal: "1,150 kcal",
  },
  {
    id: "combo-4",
    name: "Classic Butter & Hot Dog",
    tag: "QUICK BITE",
    tagColor: "bg-blue-600 text-white",
    description:
      "Medium Movie-Style Butter Popcorn + 1 Grilled Beef Hot Dog + 1 Iced Tea",
    price: "$6.00",
    rating: 4.7,
    kcal: "840 kcal",
  },
];

export default function PopcornBarSection() {
  return (
    <section className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-1.5 h-6 rounded-full inline-block bg-[#FFD700]" />
            <p className="text-xs font-black uppercase tracking-widest text-[#EAB308]">
              Fresh Cinema Concessions
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
            FilmZone Popcorn & Snack Bar
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
            Freshly popped kernels, melted cheeses, and ice-cold refreshments
            delivered right to your cinema seat.
          </p>
        </div>
      </div>

      {/* 4 Combos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SNACK_COMBOS.map((combo, idx) => {
          return (
            <ScrollReveal
              key={combo.id}
              delay={idx * 100}
              duration={650}
              distance="translate-y-8"
            >
              <div className="group relative rounded-3xl bg-white  border border-neutral-200/80 dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] hover:border-[#B90101]/60 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[360px] overflow-hidden">
                {/* Popcorn Graphic Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                {/* Top: Image & Badge */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${combo.tagColor}`}
                    >
                      {combo.tag}
                    </span>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{combo.rating}</span>
                    </div>
                  </div>

                  {/* Popcorn Visual Center */}
                  <div className="w-full h-32 flex items-center justify-center py-2">
                    <img
                      src={popcornImg}
                      alt={combo.name}
                      className="h-28 w-auto object-contain drop-shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-black text-neutral-900 dark:text-white leading-snug">
                      {combo.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {combo.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
