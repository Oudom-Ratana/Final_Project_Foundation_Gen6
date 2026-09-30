import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Plus, Minus } from "lucide-react";
import { useGetAllConcessionsQuery } from "../../services/api/cinemaApi";
import { updateConcessionQuantity } from "../../redux/slices/bookingSlice";
import { CONCESSIONS } from "../../data/concessionsData";

export default function BookingFoodDrinksSelector({ concessions = [], glassCardStyle = {} }) {
  const dispatch = useDispatch();

  const { data: apiConcessions, isLoading: isConcessionsLoading } =
    useGetAllConcessionsQuery(undefined, { refetchOnMountOrArgChange: true });

  const concessionsList = useMemo(() => {
    if (
      apiConcessions &&
      Array.isArray(apiConcessions) &&
      apiConcessions.length > 0
    ) {
      return apiConcessions.map((item) => ({
        id: item.uuid,
        uuid: item.uuid,
        name: item.name,
        price: Number(item.price) || 0,
        description: item.description ?? "",
        category: item.category,
        image:
          item.imageUrl ||
          "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=800&q=80",
      }));
    }
    return CONCESSIONS;
  }, [apiConcessions]);

  const handleAddConcession = (item) => {
    dispatch(updateConcessionQuantity({ item, delta: 1 }));
  };

  const handleRemoveConcession = (item) => {
    dispatch(updateConcessionQuantity({ item, delta: -1 }));
  };

  return (
    <div className="lg:col-span-6 flex flex-col">
      <div
        className="w-full h-full rounded-2xl sm:rounded-3xl border p-4 sm:p-5 shadow-sm backdrop-blur-md flex flex-col justify-between"
        style={glassCardStyle}
      >
        <div className="max-h-[460px] lg:max-h-[475px] overflow-y-auto pr-1 sm:pr-2 scroll-smooth custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {isConcessionsLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-2xl animate-pulse space-y-2"
                  >
                    <div className="w-full aspect-[16/10] rounded-xl bg-neutral-200 dark:bg-neutral-800/60" />
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800/60 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-800/60 rounded w-1/2" />
                  </div>
                ))
              : concessionsList.map((item) => {
                  const itemId = item.uuid ?? item.id;
                  const existing = concessions.find(
                    (c) => (c.uuid ?? c.id) === itemId,
                  );
                  const qty = existing ? existing.quantity : 0;

                  return (
                    <div
                      key={itemId}
                      className="flex flex-col justify-between space-y-2 p-1.5 rounded-2xl transition hover:scale-[1.01]"
                    >
                      <div className="w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-neutral-200 dark:bg-neutral-800">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <h3 className="font-extrabold text-xs sm:text-sm text-neutral-900 dark:text-white line-clamp-1">
                          {item.name}
                        </h3>
                        <span className="font-black text-xs sm:text-sm text-neutral-900 dark:text-white shrink-0">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-end">
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => handleAddConcession(item)}
                            className="px-3.5 py-1 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-xs tracking-wide uppercase transition active:scale-95 flex items-center gap-1 shrink-0 shadow-sm cursor-pointer"
                          >
                            <Plus className="w-3 h-3 stroke-[3]" />
                            <span>Add</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-[#B90101] text-white px-2 py-0.5 rounded-full text-xs font-black shadow-sm shrink-0">
                            <button
                              type="button"
                              onClick={() => handleRemoveConcession(item)}
                              className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-90 transition cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-2.5 h-2.5 stroke-[3]" />
                            </button>
                            <span className="min-w-[14px] text-center font-black text-xs">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddConcession(item)}
                              className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-90 transition cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-2.5 h-2.5 stroke-[3]" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}