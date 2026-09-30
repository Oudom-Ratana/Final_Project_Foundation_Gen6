import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X, CheckCircle2, QrCode, ShoppingBag, Clock, Sparkles } from "lucide-react";
import {
  useCreatePostBookingConcessionOrderMutation,
  useCreateConcessionPaymentMutation,
  useVerifyConcessionPaymentMutation,
  useGetConcessionInvoiceQuery,
} from "../../services/api/cinemaApi";

export default function ConcessionPreOrderModal({
  isOpen,
  onClose,
  bookingUuid,
  cartItems = [],
  onClearCart,
}) {
  const [step, setStep] = useState("confirm"); 
  const [concessionOrderUuid, setConcessionOrderUuid] = useState(null);
  const [paymentUuid, setPaymentUuid] = useState(null);
  const [qrPayload, setQrPayload] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const [createOrder, { isLoading: isCreatingOrder }] = useCreatePostBookingConcessionOrderMutation();
  const [createPayment, { isLoading: isCreatingPayment }] = useCreateConcessionPaymentMutation();
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyConcessionPaymentMutation();

  const { data: invoice } = useGetConcessionInvoiceQuery(concessionOrderUuid, {
    skip: !concessionOrderUuid || step !== "pickup_pass",
    pollingInterval: 3000,
  });

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (step !== "paying" || !paymentUuid) return;

    const interval = setInterval(async () => {
      try {
        const res = await verifyPayment(paymentUuid).unwrap();
        const status = (res?.status ?? res?.data?.status ?? "").toUpperCase();
        if (status === "SUCCESS" || status === "PAID") {
          clearInterval(interval);
          toast.success("Snack payment verified successfully!");
          setStep("pickup_pass");
          if (onClearCart) onClearCart();
        }
      } catch {
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [step, paymentUuid, verifyPayment, onClearCart]);

  if (!isOpen) return null;

  const handleStartCheckout = async () => {
    if (!bookingUuid) {
      toast.warn("Please select an eligible movie ticket above first!");
      return;
    }
    if (cartItems.length === 0) {
      toast.warn("Please add at least one snack to your cart!");
      return;
    }

    try {
      const itemsPayload = cartItems.map((c) => ({
        concessionItemUuid: c.uuid ?? c.id,
        quantity: c.quantity,
      }));

      const orderRes = await createOrder({
        bookingUuid,
        items: itemsPayload,
      }).unwrap();

      const orderUuid = orderRes?.uuid ?? orderRes?.concessionOrderUuid ?? orderRes?.data?.uuid;
      setConcessionOrderUuid(orderUuid);

      const payRes = await createPayment(orderUuid).unwrap();
      const pUuid = payRes?.paymentUuid ?? payRes?.uuid ?? payRes?.data?.paymentUuid;
      const qr = payRes?.qrPayload ?? payRes?.qrCode ?? payRes?.data?.qrPayload;
      const amt = payRes?.amount ?? payRes?.data?.amount ?? cartTotal;

      setPaymentUuid(pUuid);
      setQrPayload(qr);
      setPaymentAmount(amt);
      setStep("paying");
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to create snack pre-order. Make sure the ticket is confirmed.");
    }
  };

  const handleManualVerify = async () => {
    if (!paymentUuid) return;
    try {
      const res = await verifyPayment(paymentUuid).unwrap();
      const status = (res?.status ?? res?.data?.status ?? "").toUpperCase();
      if (status === "SUCCESS" || status === "PAID") {
        toast.success("Snack payment confirmed!");
        setStep("pickup_pass");
        if (onClearCart) onClearCart();
      } else {
        toast.info("Payment not received yet. Please scan with your banking app.");
      }
    } catch {
      toast.info("Payment still pending. Please complete transaction in banking app.");
    }
  };

  const pickupQrToken = invoice?.qrToken ?? invoice?.data?.qrToken;
  const qrImageSrc = pickupQrToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pickupQrToken)}`
    : qrPayload
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrPayload)}`
    : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#12161A] border border-neutral-200 dark:border-white/10 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#B90101]" />
            <h3 className="font-black text-base sm:text-lg text-neutral-900 dark:text-white">
              {step === "confirm" ? "Confirm Snack Order" : step === "paying" ? "Scan to Pay Snacks" : "Snack Pickup Pass"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.uuid ?? item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <img src={item.imageUrl || item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <span className="text-neutral-900 dark:text-white block line-clamp-1">{item.name}</span>
                      <span className="text-neutral-500 font-semibold">${Number(item.price).toFixed(2)} x {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-black text-neutral-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-dashed border-neutral-300 dark:border-white/10 text-sm font-black">
              <span className="text-neutral-600 dark:text-neutral-400">Total to Pay</span>
              <span className="text-xl text-[#B90101]">${cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleStartCheckout}
              disabled={isCreatingOrder || isCreatingPayment}
              className="w-full py-3 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isCreatingOrder || isCreatingPayment ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>GENERATING KHQR...</span>
                </>
              ) : (
                <span>Pay via Bakong KHQR (${cartTotal.toFixed(2)})</span>
              )}
            </button>
          </div>
        )}

        {step === "paying" && (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 inline-block shadow-inner mx-auto">
              {qrImageSrc ? (
                <img src={qrImageSrc} alt="Bakong KHQR" className="w-48 h-48 mx-auto object-contain rounded-lg" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse">
                  <QrCode className="w-12 h-12 text-neutral-400" />
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold">Total Amount</p>
              <h4 className="text-2xl font-black text-[#B90101]">${Number(paymentAmount).toFixed(2)}</h4>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 py-1.5 px-3 rounded-full">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Awaiting payment via ABA / Wing / Bakong...</span>
            </div>

            <button
              onClick={handleManualVerify}
              disabled={isVerifying}
              className="w-full py-2.5 rounded-full border border-neutral-300 dark:border-white/20 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-white/5 transition"
            >
              {isVerifying ? "Verifying..." : "I Have Paid (Verify Manually)"}
            </button>
          </div>
        )}

        {step === "pickup_pass" && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-black text-lg text-neutral-900 dark:text-white">Snack Pre-Order Confirmed!</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Show this QR Pass at the Popcorn counter before your movie.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 inline-block shadow-lg mx-auto">
              {qrImageSrc && (
                <img src={qrImageSrc} alt="Pickup Pass QR" className="w-52 h-52 mx-auto object-contain rounded-lg" />
              )}
              {invoice?.invoiceNumber && (
                <p className="text-[11px] font-mono font-bold text-neutral-500 mt-2">
                  {invoice.invoiceNumber}
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Ready for Counter Staff Scan</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-[#B90101] text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
