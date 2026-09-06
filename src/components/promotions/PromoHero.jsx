import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../redux/slices/uiSlice';
import { HERO_PROMOTION } from '../../data/promotionData';


export default function PromoHero() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';
  const { badge, title, description, ctaText, ctaLink, image, imageAlt, offerTag } =
    HERO_PROMOTION;

  // "DOUBLE IMPACT" 
  const titleLines = title.split(' ');

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        {/* Left: copy */}
        <div>
          <span
            className={`inline-block italic font-bold text-xs uppercase tracking-wide px-4 py-1.5 rounded-full border-2 ${
              isDark
                ? 'bg-[#FFD700] border-[#B90101] text-[#B90101]'
                : 'bg-[#FFD700] border-[#B90101] text-[#B90101]'
            }`}
          >
            {badge}
          </span>

          <h1 className={`mt-5 font-black italic leading-[0.95] tracking-tight text-5xl sm:text-6xl ${
            isDark
              ? 'text-[#FFD700]'
              : 'text-[#B90101]'
          }`}>
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div
            className={`mt-6 max-w-md rounded-2xl border-l-4 px-4 py-3.5 ${
              isDark
                ? 'bg-white/5 border-[#B90101] text-[#FFD700]'
                : 'bg-neutral-200/70 border-[#B90101] text-neutral-700'
            }`}
          >
            <p className="text-[15px] leading-relaxed">{description}</p>
          </div>

          <Link
            to={ctaLink}
            className="mt-7 inline-flex items-center gap-2 bg-[#B90101] hover:bg-[#8b0101] text-white font-semibold text-[15px] px-6 py-3 rounded-full transition-colors duration-200"
          >
            {ctaText}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Right: promo banner */}
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg">
          <img
            src={image}
            alt={imageAlt || title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}