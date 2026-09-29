import { useState } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { selectTheme } from "../../redux/slices/uiSlice";
import { useGetAllConcessionsQuery } from "../../services/api/cinemaApi";
import { FALLBACK_CONCESSIONS } from "../../data/concessionsData";
import ConcessionHero from "../../components/concessions/ConcessionHero";
import ConcessionTicker from "../../components/concessions/ConcessionTicker";
import ConcessionCard from "../../components/concessions/ConcessionCard";
import ScrollReveal from "../../components/common/ScrollReveal";
import EligibleBookingBanner from "../../components/concessions/EligibleBookingBanner";
import ConcessionPreOrderModal from "../../components/concessions/ConcessionPreOrderModal";

export default function ConcessionPage() {
  const [selectedBookingUuid, setSelectedBookingUuid] = useState("");
  const [cart, setCart] = useState({}); // { [uuid]: { item, quantity } }
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const cartItems = Object.values(cart).filter((c) => c.quantity > 0);
  const cartItemCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);
  const cartTotal = cartItems.reduce((acc, c) => acc + c.price * c.quantity, 0);

  const handleAddToCart = (item) => {
    const key = item.uuid || item.id;
    setCart((prev) => {
      const existing = prev[key];
      return {
        ...prev,
        [key]: {
          ...item,
          quantity: (existing?.quantity || 0) + 1,
        },
      };
    });
  };

  const handleRemoveFromCart = (item) => {
    const key = item.uuid || item.id;
    setCart((prev) => {
      const existing = prev[key];
      if (!existing || existing.quantity <= 1) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return {
        ...prev,
        [key]: {
          ...existing,
          quantity: existing.quantity - 1,
        },
      };
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  return (
    <div className="space-y-10 pb-24">
      <ConcessionHero />
      <ConcessionTicker />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top: Eligible Movie Booking Selector Banner */}
        <EligibleBookingBanner
          selectedBookingUuid={selectedBookingUuid}
          onSelectBooking={setSelectedBookingUuid}
        />

        {/* Catalog */}
        <ConcessionCatalog
          cart={cart}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
        />
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-[#12161A]/95 text-white border border-white/20 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B90101] flex items-center justify-center font-black text-sm shrink-0">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-sm block">
                  {cartItemCount} Snack{cartItemCount > 1 ? "s" : ""} in Cart
                </span>
                <span className="text-xs text-[#FFD700] font-black">
                  Total: ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition active:scale-95 shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Checkout Snacks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Pre-Order Checkout & KHQR Modal */}
      <ConcessionPreOrderModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        bookingUuid={selectedBookingUuid}
        cartItems={cartItems}
        onClearCart={handleClearCart}
      />

      <Outlet />
    </div>
  );
}

function ConcessionCatalog({ cart = {}, onAddToCart, onRemoveFromCart }) {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";
  const { data: apiData, isLoading } = useGetAllConcessionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Combos", "Food", "Drinks"];

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
          {filteredItems.map((item, index) => {
            const key = item.uuid || item.id;
            const currentQty = cart[key]?.quantity || 0;

            return (
              <ScrollReveal key={item.uuid} delay={index * 50} duration={600} distance="translate-y-4">
                <div className="space-y-3">
                  <ConcessionCard item={item} />
                  {/* Cart Controls directly on the card */}
                  <div className="flex items-center justify-end px-2">
                    {currentQty === 0 ? (
                      <button
                        type="button"
                        onClick={() => onAddToCart(item)}
                        className="px-4 py-1.5 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-[#B90101] text-white px-3 py-1 rounded-full text-xs font-black shadow-md">
                        <button
                          type="button"
                          onClick={() => onRemoveFromCart(item)}
                          className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-90 transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3 stroke-[3]" />
                        </button>
                        <span className="min-w-[16px] text-center font-black">{currentQty}</span>
                        <button
                          type="button"
                          onClick={() => onAddToCart(item)}
                          className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-90 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
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
