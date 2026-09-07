

import { Ticket, CreditCard, QrCode, Info } from 'lucide-react';

export default function ContactQuickCards() {
  const cards = [
    {
      id: 'booking',
      title: 'Booking Support',
      desc: 'Need help with a booking or seat selection?',
      icon: Ticket,
    },
    {
      id: 'payment',
      title: 'Payment Support',
      desc: 'Questions about payment, discounts, or promo codes?',
      icon: CreditCard,
    },
    {
      id: 'qr',
      title: 'QR Ticket Help',
      desc: 'Cannot find or scan your digital ticket?',
      icon: QrCode,
    },
    {
      id: 'cinema',
      title: 'Cinema Information',
      desc: 'Need information about halls, showtimes, or locations?',
      icon: Info,
    },
  ];

  return (
    <div className="space-y-8 font-sans">
    

      {/* Grid Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="group p-6 rounded-2xl bg-[#EFEFEF] dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 border-2 border-transparent hover:border-[#9E0000] dark:border-white/10 dark:hover:border-[#9E0000] transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-6 min-h-[170px]"
            >
              {/* Icon Container */}
              <div className="w-8 h-8 rounded-lg bg-white/60 dark:bg-white/10 group-hover:bg-[#9E0000] flex items-center justify-center transition-colors">
                <Icon className="w-4 h-4 text-[#9E0000] dark:text-white group-hover:text-white transition-colors" />
              </div>

              {/* Text Content */}
              <div>
                <h4 className="text-base font-bold text-[#9E0000] dark:text-white mb-1.5">
                  {card.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}