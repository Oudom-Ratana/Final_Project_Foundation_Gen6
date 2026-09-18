
import { Ticket, CreditCard, QrCode, Info } from "lucide-react";

export default function ContactQuickCards() {
  const cards = [
    {
      id: "booking",
      title: "Booking Support",
      desc: "Need help with a booking or seat selection?",
      icon: Ticket,
    },
    {
      id: "payment",
      title: "Payment Support",
      desc: "Questions about payment, discounts, or promo codes?",
      icon: CreditCard,
    },
    {
      id: "qr",
      title: "QR Ticket Help",
      desc: "Cannot find or scan your digital ticket?",
      icon: QrCode,
    },
    {
      id: "cinema",
      title: "Cinema Information",
      desc: "Need information about halls, showtimes, or locations?",
      icon: Info,
    },
  ];

  const handleCardClick = (cardTitle) => {
    window.dispatchEvent(
      new CustomEvent("select-support-topic", { detail: cardTitle }),
    );
    const formEl = document.getElementById("contact-form");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "center" });
      const subjectInput = formEl.querySelector('input[name="subject"]');
      if (subjectInput) {
        setTimeout(() => subjectInput.focus(), 400);
      }
    }
  };

  const renderCard = (card, key) => {
    const Icon = card.icon;
    return (
      <div
        key={key}
        onClick={() => handleCardClick(card.title)}
        className="group p-6 rounded-3xl bg-white/80 dark:bg-[#1A1F25]/40 backdrop-blur-md hover:bg-white dark:hover:bg-[#1A1F25]/80 border border-neutral-200/90 dark:border-white/20 hover:border-[var(--primary-red)] dark:hover:border-[var(--primary-red)] transition-all duration-300 cursor-pointer flex flex-col justify-between h-[190px] w-[280px] sm:w-[320px] shrink-0 select-none hover:-translate-y-1 shadow-md hover:shadow-xl dark:shadow-2xl"
      >
        {/* Icon Container */}
        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-transparent group-hover:bg-[var(--primary-red)] group-hover:border-[var(--primary-red)] flex items-center justify-center transition-colors shadow-xs">
          <Icon className="w-5 h-5 text-[var(--primary-red)] dark:text-white group-hover:text-white transition-colors" />
        </div>

        {/* Text Content */}
        <div>
          <h4 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5 group-hover:text-[var(--primary-red)] dark:group-hover:text-[var(--primary-red)] transition-colors">
            {card.title}
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-[rgba(255,255,255,0.7)] leading-relaxed">
            {card.desc}
          </p>
        </div>
      </div>
    );
  };

  // Repeated 3 times so each half is ~4,000px wide for ultra-smooth loop
  const repeatedCards = [...cards, ...cards, ...cards];

  return (
    <div className="relative w-full overflow-hidden py-4 font-sans">
      {/* Soft gradient edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-bg-light dark:from-black to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-bg-light dark:from-black to-transparent z-20" />

      {/* Infinite Left-to-Right Continuous Marquee Loop */}
      <div className="flex w-max animate-scroll-ltr">
        {/* First Half */}
        <div className="flex items-center gap-5 shrink-0 pr-5">
          {repeatedCards.map((card, i) => renderCard(card, `track1-${i}`))}
        </div>

        {/* Second Duplicate Half for seamless infinite loop */}
        <div
          className="flex items-center gap-5 shrink-0 pr-5"
          aria-hidden="true"
        >
          {repeatedCards.map((card, i) => renderCard(card, `track2-${i}`))}
        </div>
      </div>
    </div>
  );
}