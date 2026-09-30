import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export const DEFAULT_POSTER_FALLBACK =
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80";

export const FALLBACK_IMAGE_DATA_URL =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
      <rect width="300" height="450" fill="#171717"/>
      <rect x="20" y="20" width="260" height="410" fill="none" stroke="#B90101" stroke-width="3" rx="12"/>
      <text x="150" y="210" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="900" text-anchor="middle">FILMZONE</text>
      <text x="150" y="240" fill="#B90101" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">CINEMA PASS</text>
    </svg>
  `);

export function getSafePosterUrl(raw, fallback = DEFAULT_POSTER_FALLBACK) {
  if (!raw || typeof raw !== "string" || !raw.trim()) return fallback;
  const trimmed = raw.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `https://image.tmdb.org/t/p/w500${trimmed}`;
  }

  return `https://image.tmdb.org/t/p/w500/${trimmed}`;
}

async function fetchBlobWithTimeout(url, timeout = 3500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

async function imageUrlToDataUrl(url) {
  if (!url || typeof url !== "string") return FALLBACK_IMAGE_DATA_URL;
  if (url.startsWith("data:")) return url;

  if (url.startsWith("blob:")) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return await blobToDataUrl(blob);
    } catch {
      return FALLBACK_IMAGE_DATA_URL;
    }
  }

  if (url.includes("image.tmdb.org")) {
    try {
      let pathname = "";
      try {
        pathname = new URL(url).pathname;
      } catch {
        pathname = url.replace(/^https?:\/\/image\.tmdb\.org/, "");
      }
      const blob = await fetchBlobWithTimeout(`/tmdb-proxy${pathname}`);
      if (blob) {
        return await blobToDataUrl(blob);
      }
    } catch {
    }
  }

  try {
    const blob = await fetchBlobWithTimeout(url);
    if (blob) {
      return await blobToDataUrl(blob);
    }
  } catch {
  }

  try {
    const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=jpg`;
    const blob = await fetchBlobWithTimeout(proxyUrl);
    if (blob) {
      return await blobToDataUrl(blob);
    }
  } catch {
  }

  try {
    const proxyUrl2 = `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=jpg`;
    const blob = await fetchBlobWithTimeout(proxyUrl2);
    if (blob) {
      return await blobToDataUrl(blob);
    }
  } catch {
  }

  return FALLBACK_IMAGE_DATA_URL;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function downloadTicketPdf(element, bookingRef = "TICKET") {
  if (!element) {
    throw new Error("Ticket element not found for export.");
  }

  const imgElements = Array.from(element.querySelectorAll("img"));
  const originalSources = new Map();

  await Promise.all(
    imgElements.map(async (img) => {
      const originalSrc = img.src;
      originalSources.set(img, originalSrc);
      try {
        const dataUrl = await imageUrlToDataUrl(originalSrc);
        if (dataUrl && dataUrl.startsWith("data:")) {
          img.src = dataUrl;
          if (typeof img.decode === "function") {
            await img.decode().catch(() => {});
          }
        }
      } catch (err) {
        console.warn("Could not pre-convert image for PDF capture:", err);
      }
    })
  );

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 5000,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200,
      onclone: (clonedDoc, clonedElement) => {
        clonedDoc.documentElement.classList.remove("dark");
        clonedDoc.body.classList.remove("dark");

        if (clonedElement) {
          clonedElement.style.display = "flex";
          clonedElement.style.flexDirection = "row";
          clonedElement.style.alignItems = "stretch";
          clonedElement.style.justifyContent = "center";
          clonedElement.style.gap = "28px";
          clonedElement.style.width = "780px";
          clonedElement.style.maxWidth = "780px";
          clonedElement.style.margin = "0 auto";
          clonedElement.style.padding = "24px";
          clonedElement.style.boxSizing = "border-box";
          clonedElement.style.backgroundColor = "#ffffff";

          const cards = clonedElement.children;
          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            card.style.flex = "1";
            card.style.maxWidth = "360px";
            card.style.width = "360px";
            card.style.boxSizing = "border-box";
            card.style.backgroundColor = "#ffffff";
            card.style.borderColor = "#e5e7eb";
            card.style.color = "#111827";
          }
        }
      },
    });

    const imgData = canvas.toDataURL("image/png");
    if (!imgData || imgData === "data:," || imgData.length < 100) {
      throw new Error("Canvas export produced empty image data.");
    }

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const paddingX = 14;
    const paddingY = 12;
    const availableWidth = pageWidth - paddingX * 2;
    const availableHeight = pageHeight - paddingY * 2;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const scale = Math.min(availableWidth / canvasWidth, availableHeight / canvasHeight);
    const printWidth = canvasWidth * scale;
    const printHeight = canvasHeight * scale;

    const x = (pageWidth - printWidth) / 2;
    const y = (pageHeight - printHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, printWidth, printHeight, undefined, "FAST");

    const sanitizedRef = String(bookingRef).replace(/[^a-zA-Z0-9_-]/g, "");
    const fileName = `FilmZone_Ticket_${sanitizedRef || "Booking"}.pdf`;

    try {
      pdf.save(fileName);
    } catch {
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    }
  } finally {
    for (const [img, originalSrc] of originalSources.entries()) {
      img.src = originalSrc;
    }
  }
}
