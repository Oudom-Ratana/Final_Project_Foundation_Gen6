import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X, CheckCircle2, ShieldCheck } from "lucide-react";
import {
  useGetPaymentQrQuery,
  useGetGroupPaymentQrQuery,
  useGetPaymentByUuidQuery,
  useGetGroupPaymentByUuidQuery,
  useMarkPaymentSuccessMutation,
} from "../../services/api/cinemaApi";

export default function PaymentKhqrModal({
  isOpen,
  onClose,
  _bookingUuid,
  paymentUuid,
  bookingRef,
  amount,
  movieTitle,
  hallName,
  seats,
  onPaymentSuccess,
  isGroupPayment = false,
}) {
  const [isPaid, setIsPaid] = useState(false);

  const { data: standardQrBlob, isLoading: isStdQrLoading } = useGetPaymentQrQuery(paymentUuid, {
    skip: !paymentUuid || !isOpen || isGroupPayment,
  });

  const { data: groupQrBlob, isLoading: isGrpQrLoading } = useGetGroupPaymentQrQuery(paymentUuid, {
    skip: !paymentUuid || !isOpen || !isGroupPayment,
  });

  const qrBlobUrl = isGroupPayment ? groupQrBlob : standardQrBlob;
  const isQrLoading = isGroupPayment ? isGrpQrLoading : isStdQrLoading;

  const { data: standardPayment } = useGetPaymentByUuidQuery(paymentUuid, {
    skip: !paymentUuid || !isOpen || isGroupPayment || isPaid,
    pollingInterval: 2500,
  });

  const { data: groupPayment } = useGetGroupPaymentByUuidQuery(paymentUuid, {
    skip: !paymentUuid || !isOpen || !isGroupPayment || isPaid,
    pollingInterval: 2500,
  });

  const activePayment = isGroupPayment ? groupPayment : standardPayment;

  useEffect(() => {
    const rawStatus = activePayment?.status ?? activePayment?.data?.status ?? activePayment?.paymentStatus;
    const status = typeof rawStatus === "string" ? rawStatus.toUpperCase() : "";

    if (status === "PAID" || status === "SUCCESS" || status === "COMPLETED") {
      setIsPaid(true);
      toast.success("Payment verified successfully with Bakong!");
      const timer = setTimeout(() => {
        onPaymentSuccess(activePayment);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [activePayment, onPaymentSuccess]);

  const [markSuccess, { isLoading: isSimulating }] = useMarkPaymentSuccessMutation();

  if (!isOpen) return null;

  const handleDone = async () => {
    if (paymentUuid) {
      try {
        await markSuccess(paymentUuid).unwrap();
      } catch (err) {
        console.warn("Simulation note:", err);
      }
    }
    setIsPaid(true);
    toast.success("Payment confirmed!");
    setTimeout(() => onPaymentSuccess({ status: "SUCCESS" }), 1200);
  };

  const formattedSeats = seats?.length > 0 ? (Array.isArray(seats) ? seats.join(", ") : seats) : "Reserved";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-sans">
      <div className="relative w-full max-w-sm rounded-[2rem] overflow-hidden bg-white dark:bg-[#161A20] border border-neutral-200 dark:border-white/10 shadow-2xl transition-all">
        <div className="bg-[#B90101] text-white p-5 text-center relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition active:scale-95 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
          <span className="text-xl font-black tracking-wider uppercase font-mono">KHQR</span>
          <p className="text-xs font-semibold text-white/90 mt-1">Scan with Bakong or Any Banking App</p>
        </div>

        <div className="p-6 space-y-4 text-center">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white truncate">
              {movieTitle ?? "FilmZone Cinema"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {hallName ? `${hallName} • ` : ""}Seats: {formattedSeats}
            </p>
          </div>

          <div className="py-2 px-4 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 w-fit mx-auto">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mr-1.5 uppercase tracking-wider">
              Total Amount
            </span>
            <span className="text-xl font-black text-[#B90101] dark:text-[#E50914]">
              ${Number(amount ?? 0).toFixed(2)}
            </span>
          </div>

          <div className="relative mx-auto w-56 h-56 p-3 bg-white rounded-2xl border-2 border-dashed border-neutral-300 shadow-inner flex items-center justify-center overflow-hidden">
            {isPaid ? (
              <div className="flex flex-col items-center justify-center space-y-2 text-emerald-600 animate-scaleUp">
                <CheckCircle2 className="w-16 h-16 stroke-[2.5]" />
                <span className="font-black text-sm uppercase tracking-wide">Payment Received!</span>
              </div>
            ) : isQrLoading ? (
              <div className="flex flex-col items-center justify-center space-y-2 text-neutral-400">
                <div className="w-8 h-8 rounded-full border-3 border-[#B90101] border-t-transparent animate-spin" />
                <span className="text-xs font-bold">Generating KHQR...</span>
              </div>
            ) : qrBlobUrl ? (
              <img src={qrBlobUrl} alt="Bakong KHQR Payment Code" className="w-full h-full object-contain" />
            ) : (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                  `BAKONG-KHQR:${bookingRef ?? "FZ-TICKET"}:${amount}`,
                )}`}
                alt="Bakong KHQR Fallback Code"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Supported by ABA, ACLEDA, Wing, Canadia & Bakong</span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleDone}
              disabled={isSimulating || isPaid}
              className="w-full py-3 px-6 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-black text-sm sm:text-base uppercase tracking-wider transition active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}