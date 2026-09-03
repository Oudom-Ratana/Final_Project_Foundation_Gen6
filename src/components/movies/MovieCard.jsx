import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { Star } from 'lucide-react';
import { setMovie } from '../../redux/slices/bookingSlice';

export default function MovieCard({ movie }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFree = movie.isFreeStream || movie.status === 'Stream Free';
  const genreText = movie.genreLabel || (movie.genres?.map(g => g.name || g).slice(0, 1).join(', ') + ' • 2024');
  const rating = Number(movie.vote_average || 8.5).toFixed(1);

  const handleClick = (e) => {
    e.preventDefault();
    if (isFree) {
      navigate(`/stream/${movie.id}`);
    } else {
      dispatch(setMovie(movie));
      navigate(`/booking/seats?movieId=${movie.id}`);
    }
  };

  return (
    <div className="group flex flex-col space-y-3 transition-transform duration-300 hover:-translate-y-1">
      {/* Poster Image Container */}
      <div
        onClick={handleClick}
        className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-neutral-900 shadow-xl border border-white/10 cursor-pointer group-hover:border-[#B90101]/50 group-hover:shadow-[0_0_20px_rgba(185,1,1,0.3)] transition-all"
      >
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top-Right Star Rating Badge with #FFD700 */}
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[16px] font-bold border border-[#FFD700]/40 shadow-lg"
          style={{ color: '#FFD700' }}
        >
          <Star className="w-4 h-4" style={{ fill: '#FFD700', color: '#FFD700' }} />
          <span style={{ color: '#FFD700' }}>{rating}</span>
        </div>
      </div>

      {/* Card Info & Button */}
      <div className="space-y-2 px-1">
        <Link to={`/movies/${movie.id}`}>
          <h4 className="font-bold text-white text-[20px] leading-snug line-clamp-1 hover:text-[#B90101] transition">
            {movie.title}
          </h4>
        </Link>
        <p className="text-[18px] font-medium text-neutral-400">{genreText}</p>

        {/* Primary Red Button #B90101 */}
        <button
          onClick={handleClick}
          className="inline-flex items-center justify-center px-5 py-2 rounded-full text-white font-black text-[16px] uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition"
          style={{ backgroundColor: '#B90101' }}
        >
          STREAM
        </button>
      </div>
    </div>
  );
}
