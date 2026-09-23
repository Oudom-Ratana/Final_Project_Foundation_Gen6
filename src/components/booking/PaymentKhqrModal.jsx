import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  X,
  CheckCircle2,
  QrCode,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import {
  useGetPaymentQrQuery,
  useVerifyPaymentMutation,
  useMarkPaymentSuccessMutation,
} from "../../services/api/cinemaApi";

export default function PaymentKhqrModal({
  isOpen,
  onClose,
  bookingUuid,
  paymentUuid,
  bookingRef,
  amount,
  movieTitle,
  hallName,
  seats,
  onPaymentSuccess,
}) {
  const [isPaid, setIsPaid] = useState(false);

  // Fetch real Bakong KHQR image from Teacher API
  const {
    data: qrBlobUrl,
    isLoading: isQrLoading,
    isError: isQrError,
    refetch: refetchQr,
  } = useGetPaymentQrQuery(paymentUuid, {
    skip: !paymentUuid || !isOpen,
  });

  const [verifyPayment, { isLoading: isVerifying }] =
    useVerifyPaymentMutation();
  const [markSuccess, { isLoading: isSimulating }] =
    useMarkPaymentSuccessMutation();

  // Reset local state when opened
  useEffect(() => {
    if (isOpen) {
      setIsPaid(false);
    }
  }, [isOpen, paymentUuid]);

  if (!isOpen) return null;

  // Real Bakong Verification Check
  const handleVerify = async () => {
    if (!paymentUuid) return;
    try {
      const res = await verifyPayment(paymentUuid).unwrap();
      if (res?.status === "SUCCESS" || res?.status === "PAID") {
        setIsPaid(true);
        toast.success("Payment verified successfully with Bakong!");
        setTimeout(() => {
          onPaymentSuccess(res);
        }, 1200);
      } else {
        toast.info(
          "Payment not received yet. Please scan and complete the transfer in your banking app.",
        );
      }
    } catch (err) {
      console.warn("Payment verify error:", err);
      const msg =
        err?.data?.message || "Payment not detected yet. Please try again.";
      toast.warn(msg);
    }
  };

  // Simulated Test Success (provided by Teacher API for testing)
  const handleSimulateSuccess = async () => {
    if (paymentUuid) {
      try {
        await markSuccess(paymentUuid).unwrap();
      } catch (err) {
        console.warn("Simulation error on Teacher backend:", err);
      }
    }
    setIsPaid(true);
    toast.success("Payment marked as successful!");
    setTimeout(() => {
      onPaymentSuccess({ status: "SUCCESS" });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none font-sans">
      <div className="relative w-full max-w-sm rounded-[2rem] overflow-hidden bg-white dark:bg-[#161A20] border border-neutral-200 dark:border-white/10 shadow-2xl transition-all">
        {/* Top Bakong KHQR Red Header */}
        <div className="bg-[#B90101] text-white p-5 text-center relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition active:scale-95 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl font-black tracking-wider uppercase font-mono">
              KHQR
            </span>
          </div>
          <p className="text-xs font-semibold text-white/90">
            Scan with Bakong or Any Banking App
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-center">
          {/* Order Info */}
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white truncate">
              {movieTitle || "FilmZone Cinema"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {hallName ? `${hallName} • ` : ""}Seats:{" "}
              {seats?.length > 0
                ? Array.isArray(seats)
                  ? seats.join(", ")
                  : seats
                : "Reserved"}
            </p>
          </div>

          {/* Amount Pill */}
          <div className="py-2 px-4 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 w-fit mx-auto">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mr-1.5 uppercase tracking-wider">
              Total Amount
            </span>
            <span className="text-xl font-black text-[#B90101] dark:text-[#E50914]">
              ${Number(amount || 0).toFixed(2)}
            </span>
          </div>

          {/* QR Code Container */}
          <div className="relative mx-auto w-56 h-56 p-3 bg-white rounded-2xl border-2 border-dashed border-neutral-300 shadow-inner flex items-center justify-center overflow-hidden">
            {isPaid ? (
              <div className="flex flex-col items-center justify-center space-y-2 text-emerald-600 animate-scaleUp">
                <CheckCircle2 className="w-16 h-16 stroke-[2.5]" />
                <span className="font-black text-sm uppercase tracking-wide">
                  Payment Received!
                </span>
              </div>
            ) : isQrLoading ? (
              <div className="flex flex-col items-center justify-center space-y-2 text-neutral-400">
                <div className="w-8 h-8 rounded-full border-3 border-[#B90101] border-t-transparent animate-spin" />
                <span className="text-xs font-bold">Generating KHQR...</span>
              </div>
            ) : isQrError || !qrBlobUrl ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    `BAKONG-KHQR:${bookingRef || "FZ-TICKET"}:${amount}`,
                  )}`}
                  alt="Bakong KHQR Payment Code"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <img
                src={qrBlobUrl}
                alt="Bakong KHQR Payment Code"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Supported Banks Text */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Supported by ABA, ACLEDA, Wing, Canadia & Bakong</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {/* 1. Real Bakong Verify Button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying || isPaid}
              className={`w-full py-3 px-4 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isVerifying ? "opacity-75 cursor-wait" : ""
              }`}
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Checking Bakong...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Paid (Verify)</span>
                </>
              )}
            </button>

            {/* 2. Simulation Shortcut Button for Demo & Testing */}
            <button
              type="button"
              onClick={handleSimulateSuccess}
              disabled={isSimulating || isPaid}
              className="w-full py-2 px-3 rounded-full text-[11px] font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-300 dark:border-white/10 hover:border-neutral-400 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo / Test Payment Success</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
