import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { selectTheme } from '../../redux/slices/uiSlice';
import { ACTIVE_PROMOTIONS } from '../../data/promotionData';
import PromoCard from './PromoCard';


export default function ActivePromosSection() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  const standardPromos = ACTIVE_PROMOTIONS.filter((promo) => promo.type === 'standard');
  const widePromos = ACTIVE_PROMOTIONS.filter((promo) => promo.type === 'wide');

  return (
    <section className="w-full">
      <div className="flex items-center justify-between gap-4">
        <h2
          className={`font-extrabold text-lg sm:text-xl uppercase tracking-wide ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}
        >
          ACTIVE <span className="text-[#B90101]">PROMOS</span>
        </h2>

        <Link
          to="/promo"
          className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide shrink-0 transition-colors duration-200 hover:text-[#B90101] ${
            isDark ? 'text-neutral-300' : 'text-neutral-700'
          }`}
        >
          View All
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="mt-3 h-px bg-[#B90101]" />

      {standardPromos.length > 0 && (
        <div className="mt-18 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardPromos.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      )}

      {widePromos.length > 0 && (
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          {widePromos.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      )}
    </section>
  );
}