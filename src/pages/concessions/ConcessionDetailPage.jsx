import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { X, Tag } from "lucide-react";
import { selectTheme } from "../../redux/slices/uiSlice";
import { useGetConcessionByUuidQuery } from "../../services/api/cinemaApi";
import { FALLBACK_CONCESSIONS } from "../../data/concessionsData";

export default function ConcessionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  // Attempt to fetch from API
  const { data: apiItem, isLoading, isError } = useGetConcessionByUuidQuery(id, { skip: !id });

  // Fallback check
  const fallbackItem = FALLBACK_CONCESSIONS.find(item => item.uuid === id);
  const item = apiItem || fallbackItem;

  // Lock background scroll while the modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/deals", { preventScrollReset: true });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item ? item.name : "Item details"}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
      />

      {/* Modal card */}
      <div
        className={`relative w-full max-w-3xl rounded-[28px] p-6 sm:p-8 shadow-2xl ${
          isDark ? "bg-neutral-900 border border-white/10" : "bg-white"
        }`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 text-[#B90101] hover:opacity-70 transition-opacity duration-200 cursor-pointer"
        >
          <X className="w-6 h-6" strokeWidth={2.5} />
        </button>

        {isLoading && !item ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#B90101] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : item ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-square md:aspect-[4/5] bg-neutral-100 dark:bg-neutral-800">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`uppercase font-extrabold text-xs tracking-wide px-3 py-1.5 rounded-full shadow-md ${
                  item.category === "COMBO" ? "bg-[#B90101] text-white" :
                  item.category === "FOOD" ? "bg-[#FFD700] text-neutral-900" :
                  "bg-blue-600 text-white"
                }`}>
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="pt-1 sm:pt-4 pr-8">
              <h2
                className={`font-extrabold text-3xl sm:text-4xl leading-[1.1] ${
                  isDark ? "text-white" : "text-neutral-700"
                }`}
              >
                {item.name}
              </h2>

              <div className="mt-5">
                <div className={`text-4xl font-black ${isDark ? "text-[#FFD700]" : "text-[#B90101]"}`}>
                  ${Number(item.price).toFixed(2)}
                </div>
              </div>

              <div className="mt-6 h-px bg-[#B90101]/20 dark:bg-[#B90101]/40" />

              <p
                className={`mt-6 text-[16px] leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}
              >
                {item.description}
              </p>
              
              <div className="mt-8 flex items-center gap-2">
                 <Tag className="w-5 h-5 text-[#B90101]" />
                 <span className={`text-sm font-semibold uppercase ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                   Exclusive Cinema Deal
                 </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p
              className={`text-[15px] ${isDark ? "text-neutral-300" : "text-neutral-700"}`}
            >
              This item couldn't be found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
