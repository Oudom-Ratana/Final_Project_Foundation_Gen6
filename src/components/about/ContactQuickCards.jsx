import { Ticket, CreditCard, QrCode, Building2 } from 'lucide-react';

export default function ContactQuickCards() {
  const cards = [
    {
      id: 'booking',
      title: 'Booking Support',
      desc: 'Need help with tickets, showtimes, or cinema halls?',
      icon: Ticket,
    },
    {
      id: 'payment',
      title: 'Payment Support',
      desc: 'Questions about ABA PAY, card, or payment status?',
      icon: CreditCard,
    },
    {
      id: 'qr',
      title: 'QR Ticket Help',
      desc: 'Issues scanning or retrieving your digital e-ticket?',
      icon: QrCode,
    },
    {
      id: 'cinema',
      title: 'Cinema Information',
      desc: 'Branch locations, parking, and snacks inquiries.',
      icon: Building2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-sans">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="p-6 rounded-3xl bg-white dark:bg-black/50 border border-neutral-200/90 dark:border-white/10 shadow-md dark:shadow-xl hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 space-y-3"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: '#B90101' }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <h4 className="text-[18px] font-black text-neutral-900 dark:text-white">
              {card.title}
            </h4>
            <p className="text-[15px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {card.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
