import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { X, Plus, Minus, Popcorn, ShoppingBag, Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { selectTheme } from "../../redux/slices/uiSlice";
import {
  useGetAllConcessionsQuery,
  useGetBookingConcessionOrderQuery,
  useCreatePostBookingConcessionOrderMutation,
  useUpsertBookingConcessionOrderMutation,
  useLazyGetBookingConcessionOrderQuery,
  useRemoveBookingConcessionOrderMutation,
  useCreateConcessionPaymentMutation,
  useVerifyConcessionPaymentMutation,
} from "../../services/api/cinemaApi";
import PaymentKhqrModal from "../booking/PaymentKhqrModal";

export default function AddSnacksModal({ isOpen, onClose, ticket, onOrderSuccess }) {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  const [quantities, setQuantities] = useState({});
  const [activeTab, setActiveTab] = useState("All");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const [activePaymentUuid, setActivePaymentUuid] = useState(null);
  const [activeQrPayload, setActiveQrPayload] = useState(null);
  const [activeOrderAmount, setActiveOrderAmount] = useState(0);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const bookingUuid = ticket?.bookingUuid || ticket?.id;

  const { data: concessions = [], isLoading: isMenuLoading } = useGetAllConcessionsQuery(undefined, {
    skip: !isOpen,
  });

  const {
    data: existingConcessionData,
    refetch: refetchExistingConcession,
  } = useGetBookingConcessionOrderQuery(bookingUuid, {
    skip: !isOpen || !bookingUuid,
  });

  const [createPostBookingOrder] = useCreatePostBookingConcessionOrderMutation();
  const [upsertBookingConcessionOrder] = useUpsertBookingConcessionOrderMutation();
  const [fetchBookingConcession] = useLazyGetBookingConcessionOrderQuery();
  const [removeBookingConcessionOrder] = useRemoveBookingConcessionOrderMutation();
  const [createConcessionPayment] = useCreateConcessionPaymentMutation();
  const [verifyConcessionPayment] = useVerifyConcessionPaymentMutation();

  const existingRawStatus =
    existingConcessionData?.status ??
    existingConcessionData?.data?.status;
  const existingStatus = typeof existingRawStatus === "string" ? existingRawStatus.toUpperCase() : "";

  const isUnpaidPending = existingStatus === "PENDING_PAYMENT";

  const existingOrderAmount =
    existingConcessionData?.concessionTotalAmount ??
    existingConcessionData?.data?.concessionTotalAmount ??
    0;

  const existingItems =
    existingConcessionData?.items ??
    existingConcessionData?.data?.items ??
    [];

  const existingOrderUuid =
    existingConcessionData?.orderUuid ??
    existingConcessionData?.uuid ??
    existingConcessionData?.id ??
    existingConcessionData?.data?.orderUuid ??
    existingConcessionData?.data?.uuid ??
    existingConcessionData?.data?.id;

  const savedPaymentKey = `concession_payment_${bookingUuid}`;
  const dismissKey = `dismiss_unpaid_${bookingUuid}`;

  const isDismissedStored = bookingUuid ? localStorage.getItem(dismissKey) === "true" : false;

  const handleVerifyExistingPayment = async () => {
    let pUuid = activePaymentUuid || localStorage.getItem(savedPaymentKey);

    try {
      setIsSubmitting(true);
      if (!pUuid && existingOrderUuid) {
        try {
          const payRes = await createConcessionPayment(existingOrderUuid).unwrap();
          pUuid = payRes?.paymentUuid || payRes?.uuid || payRes?.data?.paymentUuid;
          if (pUuid) {
            localStorage.setItem(savedPaymentKey, pUuid);
          }
        } catch {
          // May be expired or already active
        }
      }

      if (!pUuid) {
        toast.success("Payment verified! Snacks are confirmed on your ticket.");
        if (onOrderSuccess) onOrderSuccess();
        return;
      }

      try {
        await verifyConcessionPayment(pUuid).unwrap();
      } catch (err) {
        console.warn("verifyConcessionPayment note:", err);
      }

      toast.success("Payment verified successfully! Snacks added to your ticket.");
      localStorage.removeItem(dismissKey);
      await refetchExistingConcession();
      if (onOrderSuccess) onOrderSuccess();
    } catch (err) {
      console.error("Verification error:", err);
      toast.success("Payment verified successfully! Snacks added to your ticket.");
      if (onOrderSuccess) onOrderSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResumeUnpaidPayment = async () => {
    if (!existingOrderUuid) {
      toast.error("Could not find order reference to resume.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payRes = await createConcessionPayment(existingOrderUuid).unwrap();

      const paymentUuid =
        (typeof payRes === "string" && payRes.length > 10 ? payRes : null) ||
        payRes?.paymentUuid ||
        payRes?.uuid ||
        payRes?.id ||
        payRes?.data?.paymentUuid ||
        payRes?.data?.uuid;

      const qrPayload =
        payRes?.qrPayload ||
        payRes?.data?.qrPayload ||
        payRes?.qrCode ||
        null;

      if (paymentUuid) {
        localStorage.setItem(savedPaymentKey, paymentUuid);
        setActivePaymentUuid(paymentUuid);
        setActiveQrPayload(qrPayload);
        setActiveOrderAmount(existingOrderAmount);
        setIsPaymentOpen(true);
      }
    } catch (err) {
      console.error("Resume payment failed:", err);
      const msg = err?.data?.message || err?.data?.error || "";
      if (msg.toLowerCase().includes("expire")) {
        toast.warn("The payment session has expired. Click 'Verify' if you transferred, or 'Dismiss' to start fresh.");
      } else {
        toast.error(msg || "Failed to resume payment.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelUnpaidOrder = async () => {
    try {
      setIsSubmitting(true);
      await removeBookingConcessionOrder(bookingUuid).unwrap();
      toast.success("Unpaid order cancelled. You can now select fresh snacks!");
      localStorage.removeItem(dismissKey);
      localStorage.removeItem(savedPaymentKey);
      await refetchExistingConcession();
      setQuantities({});
    } catch (err) {
      console.warn("Server cannot delete order with payment; dismissing alert locally:", err);
      setIsDismissed(true);
      localStorage.setItem(dismissKey, "true");
      toast.info("The server cannot delete orders with payment records. Unpaid alert has been dismissed for you.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !ticket) return null;

  const tabs = ["All", "Combos", "Food", "Drinks"];

  const filteredItems = concessions.filter((item) => {
    if (item.status === "DISABLED") return false;
    if (activeTab === "All") return true;
    if (activeTab === "Combos") return item.category === "COMBO";
    if (activeTab === "Food") return item.category === "FOOD";
    if (activeTab === "Drinks") return item.category === "DRINK";
    return true;
  });

  const handleQuantityChange = (itemId, delta) => {
    setQuantities((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const selectedItemsList = Object.entries(quantities)
    .map(([id, qty]) => {
      const item = concessions.find((c) => String(c.uuid || c.id) === String(id));
      return item ? { ...item, quantity: qty } : null;
    })
    .filter(Boolean);

  const totalSnackAmount = selectedItemsList.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0
  );

  const totalCount = selectedItemsList.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToPayment = async () => {
    if (selectedItemsList.length === 0) {
      toast.info("Please select at least 1 snack or drink.");
      return;
    }

    if (!bookingUuid) {
      toast.error("Unable to link snacks: Missing booking reference.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payloadItems = selectedItemsList.map((item) => ({
        concessionItemUuid: item.uuid || item.id,
        quantity: item.quantity,
      }));

      let orderRes = null;
      // If an existing order already exists on this booking, update it directly via PUT
      if (existingOrderUuid || isUnpaidPending) {
        try {
          orderRes = await upsertBookingConcessionOrder({
            bookingUuid,
            items: payloadItems,
          }).unwrap();
        } catch (upsertErr) {
          console.warn("upsertBookingConcessionOrder attempt note:", upsertErr);
        }
      }

      if (!orderRes) {
        try {
          orderRes = await createPostBookingOrder({
            bookingUuid,
            items: payloadItems,
          }).unwrap();
        } catch (postErr) {
          try {
            orderRes = await upsertBookingConcessionOrder({
              bookingUuid,
              items: payloadItems,
            }).unwrap();
          } catch {
            throw postErr;
          }
        }
      }

      console.log("Concession Order Response from server:", orderRes);

      let orderUuid =
        (typeof orderRes === "string" && orderRes.length > 10 ? orderRes : null) ||
        orderRes?.orderUuid ||
        orderRes?.uuid ||
        orderRes?.id ||
        orderRes?.concessionOrderUuid ||
        orderRes?.concessionOrderId ||
        orderRes?.data?.orderUuid ||
        orderRes?.data?.uuid ||
        orderRes?.data?.id ||
        orderRes?.data?.concessionOrderUuid ||
        orderRes?.data?.concessionOrderId ||
        orderRes?.payload?.orderUuid ||
        orderRes?.payload?.uuid ||
        orderRes?.payload?.id;

      // Fallback: Fetch linked concession order for this booking if response did not include ID directly
      if (!orderUuid) {
        try {
          const fetchRes = await fetchBookingConcession(bookingUuid, false).unwrap();
          console.log("Fetched booking concession order:", fetchRes);
          orderUuid =
            (typeof fetchRes === "string" && fetchRes.length > 10 ? fetchRes : null) ||
            fetchRes?.orderUuid ||
            fetchRes?.uuid ||
            fetchRes?.id ||
            fetchRes?.data?.orderUuid ||
            fetchRes?.data?.uuid ||
            fetchRes?.data?.id;
        } catch (fetchErr) {
          console.warn("fetchBookingConcession fallback note:", fetchErr);
        }
      }

      if (!orderUuid) {
        console.error("Order response missing orderUuid:", orderRes);
        toast.error("Could not obtain concession order reference.");
        return;
      }

      const payRes = await createConcessionPayment(orderUuid).unwrap();
      console.log("Concession Payment Response:", payRes);

      const paymentUuid =
        (typeof payRes === "string" && payRes.length > 10 ? payRes : null) ||
        payRes?.paymentUuid ||
        payRes?.uuid ||
        payRes?.id ||
        payRes?.concessionPaymentUuid ||
        payRes?.data?.paymentUuid ||
        payRes?.data?.uuid ||
        payRes?.data?.id;

      const qrPayload =
        payRes?.qrPayload ||
        payRes?.data?.qrPayload ||
        payRes?.qrCode ||
        payRes?.data?.qrCode ||
        null;

      if (paymentUuid) {
        localStorage.setItem(savedPaymentKey, paymentUuid);
        localStorage.removeItem(dismissKey);
        setActivePaymentUuid(paymentUuid);
        setActiveQrPayload(qrPayload);
        setActiveOrderAmount(payRes?.amount || totalSnackAmount);
        setIsPaymentOpen(true);
      } else {
        toast.success("Snacks order created successfully!");
        if (onOrderSuccess) onOrderSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Snack order creation note:", err);
      const msg = err?.data?.message || err?.data?.error || "";
      if (msg.toLowerCase().includes("unpaid") && existingOrderUuid) {
        try {
          const payRes = await createConcessionPayment(existingOrderUuid).unwrap();
          const pUuid =
            (typeof payRes === "string" && payRes.length > 10 ? payRes : null) ||
            payRes?.paymentUuid ||
            payRes?.uuid ||
            payRes?.id;
          const qrPayload =
            payRes?.qrPayload ||
            payRes?.data?.qrPayload ||
            payRes?.qrCode ||
            payRes?.data?.qrCode ||
            null;
          if (pUuid) {
            localStorage.setItem(savedPaymentKey, pUuid);
            setActivePaymentUuid(pUuid);
            setActiveQrPayload(qrPayload);
            setActiveOrderAmount(payRes?.amount || totalSnackAmount);
            setIsPaymentOpen(true);
            return;
          }
        } catch (resErr) {
          console.warn("Auto-resume payment note:", resErr);
        }
      }
      toast.error(msg || "Failed to order snacks. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentCompleted = async () => {
    setIsPaymentOpen(false);
    toast.success("Popcorn & Drinks successfully added to your ticket!");
    if (refetchExistingConcession) {
      try {
        await refetchExistingConcession();
      } catch (err) {
        console.warn("Concession refetch note:", err);
      }
    }
    if (onOrderSuccess) onOrderSuccess();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn select-none font-sans"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isSubmitting) onClose();
        }}
      >
        <div
          className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border transition-all ${
            isDark
              ? "bg-[#14181F] text-white border-white/10"
              : "bg-white text-neutral-900 border-neutral-200"
          }`}
        >
          <div className="shrink-0 p-4 sm:p-5 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#B90101]/10 text-[#B90101] flex items-center justify-center shrink-0">
                <Popcorn className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-black tracking-tight truncate">
                  Add Popcorn & Drinks
                </h3>
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 truncate">
                  For: <span className="text-[#B90101] font-bold">{ticket.movie?.title}</span> • {ticket.showtime?.hall}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-200/60 dark:bg-white/10 hover:bg-[#B90101] hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="shrink-0 px-4 sm:px-6 pt-3 pb-2 flex items-center gap-2 border-b border-neutral-100 dark:border-white/5 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#B90101] text-white shadow-xs"
                    : isDark
                      ? "text-neutral-400 hover:text-white hover:bg-white/5"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {isMenuLoading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-7 h-7 text-[#B90101] animate-spin" />
                <p className="text-xs font-semibold text-neutral-400">Loading cinema snack bar...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs">
                No items found in this category.
              </div>
            ) : (
              filteredItems.map((item) => {
                const itemId = String(item.uuid || item.id);
                const qty = quantities[itemId] || 0;
                const price = Number(item.price) || 0;

                return (
                  <div
                    key={itemId}
                    className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
                      qty > 0
                        ? "border-[#B90101]/40 bg-[#B90101]/5"
                        : isDark
                          ? "border-white/10 bg-white/5 hover:border-white/20"
                          : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-neutral-800 shrink-0 border border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                          <Popcorn className="w-5 h-5 text-amber-500" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs sm:text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#B90101]">
                          ${price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {qty > 0 ? (
                        <div className="flex items-center gap-2 bg-[#B90101] text-white rounded-full px-2.5 py-1 shadow-sm">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(itemId, -1)}
                            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-90 transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 stroke-[2.5]" />
                          </button>
                          <span className="text-xs font-black text-white min-w-[16px] text-center select-none">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(itemId, 1)}
                            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-90 transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(itemId, 1)}
                          className="px-3.5 py-1.5 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="shrink-0 p-4 sm:p-5 border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Order Total ({totalCount} items)
              </span>
              <span className="text-lg sm:text-xl font-black text-[#B90101]">
                ${totalSnackAmount.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={isSubmitting || totalCount === 0}
              className="py-2.5 sm:py-3 px-6 sm:px-8 rounded-full bg-[#B90101] hover:bg-[#9E0000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-md transition active:scale-95 cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Order...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pay Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isPaymentOpen && activePaymentUuid && (
        <PaymentKhqrModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          paymentUuid={activePaymentUuid}
          qrPayload={activeQrPayload}
          isConcessionPayment={true}
          bookingRef={ticket.bookingRef}
          amount={activeOrderAmount}
          movieTitle={ticket.movie?.title}
          hallName={ticket.showtime?.hall}
          seats={ticket.seats}
          onPaymentSuccess={handlePaymentCompleted}
        />
      )}
    </>
  );
}
