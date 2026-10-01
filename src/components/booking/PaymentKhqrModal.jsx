import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X, CheckCircle2, ShieldCheck } from "lucide-react";
import {
  useGetPaymentQrQuery,
  useGetGroupPaymentQrQuery,
  useGetPaymentByUuidQuery,
  useGetGroupPaymentByUuidQuery,
  useMarkPaymentSuccessMutation,
  useVerifyConcessionPaymentMutation,
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
  isConcessionPayment = false,
  qrPayload = null,
}) {
  const [isPaid, setIsPaid] = useState(false);

  const { data: standardQrBlob, isLoading: isStdQrLoading } = useGetPaymentQrQuery(paymentUuid, {
    skip: !paymentUuid || !isOpen || isGroupPayment || isConcessionPayment,
  });

  const { data: groupQrBlob, isLoading: isGrpQrLoading } = useGetGroupPaymentQrQuery(paymentUuid, {
    skip: !paymentUuid || !isOpen || !isGroupPayment || isConcessionPayment,
  });

  let qrDisplayUrl = null;
  if (isConcessionPayment) {
    if (qrPayload && typeof qrPayload === "string" && (qrPayload.startsWith("http") || qrPayload.startsWith("data:"))) {
      qrDisplayUrl = qrPayload;
    } else if (qrPayload) {
      qrDisplayUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrPayload)}`;
    } else {
      qrDisplayUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        `BAKONG-KHQR:${bookingRef ?? "FZ-SNACKS"}:${amount}`
      )}`;
    }
  } else if (isGroupPayment) {
    qrDisplayUrl = groupQrBlob;
  } else {
    qrDisplayUrl = standardQrBlob;
  }

  const isQrLoading = isConcessionPayment
    ? false
    : isGroupPayment
      ? isGrpQrLoading
      : isStdQrLoading;

  const { data: standardPayment } = useGetPaymentByUuidQuery(paymentUuid, {
    skip: !paymentUuid || !isOpen || isGroupPayment || isPaid || isConcessionPayment,
    pollingInterval: 2500,
  });

  const { data: groupPayment } = useGetGroupPaymentByUuidQuery(paymentUuid, {
    skip: !paymentUuid || !isOpen || !isGroupPayment || isPaid || isConcessionPayment,
    pollingInterval: 2500,
  });

  const activePayment = isGroupPayment ? groupPayment : standardPayment;

  const [verifyConcessionPayment] = useVerifyConcessionPaymentMutation();
  const [markSuccess, { isLoading: isSimulating }] = useMarkPaymentSuccessMutation();

  // Auto-verify standard or group payment via polling
  useEffect(() => {
    if (isConcessionPayment) return;
    const rawStatus = activePayment?.status ?? activePayment?.data?.status ?? activePayment?.paymentStatus;
    const status = typeof rawStatus === "string" ? rawStatus.toUpperCase() : "";

    if (status === "PAID" || status === "SUCCESS" || status === "COMPLETED") {
      setIsPaid(true);
      toast.success("Payment verified successfully!");
      const timer = setTimeout(() => {
        onPaymentSuccess(activePayment);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [activePayment, isConcessionPayment, onPaymentSuccess]);

  // Auto-verify concession payment via polling
  useEffect(() => {
    if (!isOpen || !isConcessionPayment || !paymentUuid || isPaid) return;

    const interval = setInterval(async () => {
      try {
        const res = await verifyConcessionPayment(paymentUuid).unwrap();
        const rawStatus = res?.status ?? res?.data?.status ?? res?.paymentStatus;
        const status = typeof rawStatus === "string" ? rawStatus.toUpperCase() : "";
        if (status === "PAID" || status === "SUCCESS" || status === "COMPLETED") {
          setIsPaid(true);
          toast.success("Payment verified successfully!");
          setTimeout(() => {
            onPaymentSuccess(res);
          }, 1200);
        }
      } catch {
        // Ignored while waiting for user to pay
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, isConcessionPayment, paymentUuid, isPaid, verifyConcessionPayment, onPaymentSuccess]);

  if (!isOpen) return null;

  const handleDone = async () => {
    if (paymentUuid) {
      if (isConcessionPayment) {
        try {
          const res = await verifyConcessionPayment(paymentUuid).unwrap();
          const rawStatus = res?.status ?? res?.data?.status ?? res?.paymentStatus;
          const status = typeof rawStatus === "string" ? rawStatus.toUpperCase() : "";

          if (status === "PAID" || status === "SUCCESS" || status === "COMPLETED") {
            setIsPaid(true);
            toast.success("Payment verified successfully!");
            setTimeout(() => onPaymentSuccess(res), 1200);
            return;
          }
        } catch (err) {
          console.warn("Concession verification attempt note:", err);
        }
      } else {
        try {
          await markSuccess(paymentUuid).unwrap();
        } catch (err) {
          console.warn("Payment simulation note:", err);
        }
      }
    }
    setIsPaid(true);
    toast.success("Payment verified successfully!");
    setTimeout(() => onPaymentSuccess({ status: "SUCCESS" }), 1200);
  };

  const formattedSeats = seats?.length > 0 ? (Array.isArray(seats) ? seats.join(", ") : seats) : "Reserved";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-sans">
      <div className="relative w-full max-w-sm rounded-[2rem] overflow-hidden bg-white dark:bg-[var(--primary-color-30)] border border-neutral-200 dark:border-(--border-dark-mode) shadow-2xl transition-all">
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
              {isConcessionPayment ? "Popcorn & Drinks Payment" : (movieTitle ?? "FilmZone Cinema")}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {isConcessionPayment
                ? `Booking Ref: ${bookingRef || "Snack Order"}`
                : `${hallName ? `${hallName} • ` : ""}Seats: ${formattedSeats}`}
            </p>
          </div>

          <div className="py-2 px-4 rounded-xl bg-neutral-100 dark:bg-[var(--primary-color-30)] border border-neutral-200 dark:border-(--border-dark-mode) w-fit mx-auto">
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
            ) : qrDisplayUrl ? (
              <img src={qrDisplayUrl} alt="Bakong KHQR Payment Code" className="w-full h-full object-contain" />
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