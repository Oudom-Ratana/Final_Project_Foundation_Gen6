






import { Clapperboard, Film, Tv } from "lucide-react";

const TABS = [
  { name: "Cinema Catalog", icon: Film },
  { name: "TMDB Movies", icon: Clapperboard },
  { name: "TMDB TV Series", icon: Tv },
];

export default function MovieLibraryTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
      <div className="flex space-x-1.5 bg-slate-200/60 p-1.5 rounded-full">
        {TABS.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-medium rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-white text-[#E50914] font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              {tab.name}
            </button>
          );
        })}
      </div>

    </div>
  );
}
