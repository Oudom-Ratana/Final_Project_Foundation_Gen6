import { TICKER_ITEMS } from '../../data/promotionData';


export default function PromoTicker() {
  return (
    <div className="relative w-full overflow-x-hidden py-8">
      <section
        role="marquee"
        aria-label="Promotions"
        className="relative left-[-8%] w-[116%] overflow-hidden bg-[#FFD700] py-2.5 -rotate-2 origin-center shadow-lg"
      >
        <style>{`
          @keyframes promo-ticker-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .promo-ticker-track {
            animation: promo-ticker-scroll 22s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .promo-ticker-track {
              animation: none;
            }
          }
        `}</style>

        <div className="flex w-max promo-ticker-track">
          {/* Real, screen-reader-visible copy */}
          <TickerHalf ariaHidden={false} />
          {/* Duplicate copy purely for the seamless visual loop */}
          <TickerHalf ariaHidden />
        </div>
      </section>
    </div>
  );
}

function TickerHalf({ ariaHidden }) {
  return (
    <div className="flex items-center shrink-0" aria-hidden={ariaHidden}>
      {TICKER_ITEMS.map((label, i) => (
        <span key={i} className="flex items-center shrink-0 whitespace-nowrap">
          <span className="text-neutral-900 font-extrabold text-sm uppercase tracking-wide">
            {label === 'HOT DEALS ONLY' ? '  ' : ''}
            {label}
          </span>
          <span className="mx-6 text-[#B90101] text-base leading-none" aria-hidden="true">
            ♦
          </span>
        </span>
      ))}
    </div>
  );
}