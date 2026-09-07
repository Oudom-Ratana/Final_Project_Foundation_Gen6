
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
      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="group p-6 rounded-2xl bg-[#EFEFEF] hover:bg-white border-2 border-transparent hover:border-[#B90101] transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-6 min-h-[170px]"
            >
              {/* Icon Badge */}
              <div className="w-9 h-9 rounded-xl bg-white/70 group-hover:bg-[#B90101] flex items-center justify-center border border-neutral-200/50 group-hover:border-transparent transition-colors duration-200">
                <Icon className="w-4 h-4 text-[#B90101] group-hover:text-white transition-colors duration-200" />
              </div>

              {/* Text Content */}
              <div>
                <h4 className="text-base font-bold text-[#B90101] mb-1.5">
                  {card.title}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
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