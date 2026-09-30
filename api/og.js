export default async function handler(req, res) {
  const { path = "" } = req.query;
  const segments = String(path).replace(/^\/+|\/+$/g, "").split("/");
  const section = segments[0] || "";
  const id = segments[1] || "";

  let title = "FilmZone - Cinema & Free Stream";
  let description = "Discover trending movies and TV series, book cinema tickets, and stream for free on FilmZone.";
  let image = "https://filmzone-foundation-gen6.vercel.app/og-image.jpg";
  let canonicalUrl = `https://filmzone-foundation-gen6.vercel.app/${path}`;
  let type = "website";

  try {
    if ((section === "movie" || section === "movies") && id) {
      type = "video.movie";
      const apiRes = await fetch(
        `https://cinema-booking-api.eunglyzhia.com/api/v1/movies/${encodeURIComponent(id)}`,
        { headers: { Accept: "application/json" } }
      );
      if (apiRes.ok) {
        const movie = await apiRes.json();
        title = movie.title || movie.originalTitle || "FilmZone Cinema";
        description =
          movie.overview ||
          `Watch ${title} on the big screen with premium sound and visuals at FilmZone.`;
        if (movie.backdropUrl) {
          image = movie.backdropUrl;
        } else if (movie.posterUrl) {
          image = movie.posterUrl;
        }
      }
    } else if (section === "stream" && id) {
      type = "video.movie";
      // Try TMDB movie or fallback
      const tmdbToken = process.env.VITE_TMDB_ACCESS_TOKEN || process.env.TMDB_ACCESS_TOKEN;
      const headers = { Accept: "application/json" };
      if (tmdbToken) {
        headers["Authorization"] = `Bearer ${tmdbToken}`;
      }
      const apiRes = await fetch(
        `https://api.themoviedb.org/3/movie/${encodeURIComponent(id)}`,
        { headers }
      );
      if (apiRes.ok) {
        const streamData = await apiRes.json();
        title = streamData.title || streamData.name || "FilmZone Stream";
        description = streamData.overview || `Stream ${title} in HD on FilmZone for free.`;
        if (streamData.backdrop_path) {
          image = `https://image.tmdb.org/t/p/w1280${streamData.backdrop_path}`;
        } else if (streamData.poster_path) {
          image = `https://image.tmdb.org/t/p/w780${streamData.poster_path}`;
        }
      }
    } else if (section === "deals" || section === "promo") {
      title = "Cinema Popcorn, Drinks & Combos | FilmZone Deals";
      description = "Grab hot buttery popcorn, refreshing sodas, and exclusive snack combos at FilmZone Cinema.";
    } else if (section === "about") {
      title = "About Us | FilmZone Cinema";
      description = "Learn about FilmZone, our vision, cutting-edge cinema technology, and our team.";
    }
  } catch (err) {
    // Graceful fallback to default FilmZone meta
    console.error("OG Generator Error:", err);
  }

  const formattedTitle = title.includes("FilmZone") ? title : `${title} | FilmZone`;

  // Return crawler-friendly HTML with Open Graph & Twitter Cards
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(formattedTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="${escapeHtml(type)}" />
  <meta property="og:site_name" content="FilmZone" />
  <meta property="og:title" content="${escapeHtml(formattedTitle)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
  <meta property="og:image:alt" content="${escapeHtml(formattedTitle)}" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(formattedTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />

  <!-- Instant Browser Redirect if visited by non-crawler -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(canonicalUrl)}" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
</head>
<body style="font-family:sans-serif;background:#111;color:#eee;padding:2rem;text-align:center;">
  <h2>${escapeHtml(formattedTitle)}</h2>
  <p>${escapeHtml(description)}</p>
  <p><a href="${escapeHtml(canonicalUrl)}" style="color:#e50914;">Click here to continue to FilmZone</a></p>
</body>
</html>`;

  res.status(200).send(html);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
