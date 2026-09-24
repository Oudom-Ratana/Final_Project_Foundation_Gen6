import { useState } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/slices/uiSlice";
import { useGetAllConcessionsQuery } from "../../services/api/cinemaApi";
import { FALLBACK_CONCESSIONS } from "../../data/concessionsData";
import ConcessionHero from "../../components/concessions/ConcessionHero";
import ConcessionTicker from "../../components/concessions/ConcessionTicker";
import ConcessionCard from "../../components/concessions/ConcessionCard";
import ScrollReveal from "../../components/common/ScrollReveal";

export default function ConcessionPage() {
  return (
    <div className="space-y-12 pb-8">
      <ConcessionHero />
      <ConcessionTicker />
      <ConcessionCatalog />
      <Outlet />
    </div>
  );
}

function ConcessionCatalog() {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";
  const { data: apiData, isLoading, isError } = useGetAllConcessionsQuery();

  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Combos", "Food", "Drinks"];

  // Use API data if available and not empty, otherwise fallback
  const items = (apiData && apiData.length > 0) ? apiData : FALLBACK_CONCESSIONS;

  const filteredItems = items.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Combos") return item.category === "COMBO";
    if (activeTab === "Food") return item.category === "FOOD";
    if (activeTab === "Drinks") return item.category === "DRINK";
    return true;
  });

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className={`text-2xl sm:text-3xl font-black italic tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
          CINEMA MENU
        </h2>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide transition-colors ${
                activeTab === tab
                  ? "bg-[#B90101] text-white"
                  : isDark
                  ? "bg-white/10 text-neutral-300 hover:bg-white/20"
                  : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#B90101] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => (
            <ScrollReveal key={item.uuid} delay={index * 50} duration={600} distance="translate-y-4">
              <ConcessionCard item={item} />
            </ScrollReveal>
          ))}
          {filteredItems.length === 0 && (
            <div className={`col-span-full text-center py-12 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              No items found for this category.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
