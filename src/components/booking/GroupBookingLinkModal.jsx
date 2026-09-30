import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { X, Copy, Check, Users } from "lucide-react";
import { selectTheme } from "../../redux/slices/uiSlice";

export default function GroupBookingLinkModal({
  isOpen,
  onClose,
  onContinue,
  onCreateGroup,
  groupCode = "",
  inviteToken = "",
  groupName = "",
  defaultGroupName = "",
  isLoading = false,
}) {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";
  const [copied, setCopied] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNameInput(groupName || defaultGroupName || "FilmZone Squad");
    }
  }, [isOpen, groupName, defaultGroupName]);

  const token = inviteToken || groupCode;
  const hasToken = Boolean(token);
  const shareUrl = token
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/group-booking/join/${token}`
    : "";

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    const header = document.querySelector("header");

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      if (header) {
        header.style.display = "none";
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      if (header) {
        header.style.display = "";
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmitName = (e) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    if (onCreateGroup) {
      onCreateGroup(trimmed);
    }
  };

  const handleShare = (platform) => {
    const fullMessage = `Join my group booking on FilmZone! Pick your seat here: ${shareUrl}`;

    switch (platform) {
      case "telegram":
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(fullMessage)}`,
          "_blank",
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank",
        );
        break;
      default:
        handleCopy();
    }
  };



  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-white dark:bg-[var(--primary-color-30)] backdrop-blur-md animate-fadeIn select-none font-sans"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-[2.5rem] border p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-all scale-100 space-y-5 text-center"
        style={{
          backgroundColor: isDark ? "var(--primary-color-30)" : "#ffffff",
          borderColor: isDark
            ? "var(--border-dark-mode)"
            : "rgba(39, 42, 48, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#B90101] hover:scale-110 active:scale-95 transition p-1 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {!hasToken ? (
          <div className="space-y-5 pt-2">
            <div className="flex justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#B90101]/15 dark:bg-[#B90101]/25 border border-[#B90101]/30 flex items-center justify-center shadow-inner backdrop-blur-md text-[#B90101]">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl sm:text-3xl font-black text-[#B90101] tracking-tight">
                Name Your Squad
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed">
                Give your squad a custom name before sharing the invite link.
              </p>
            </div>

            <form onSubmit={handleSubmitName} className="space-y-4 max-w-sm mx-auto pt-1">
              <div className="text-left space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 pl-1">
                  Squad Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Movie Gang, Dara & Friends..."
                  maxLength={40}
                  className="w-full px-5 py-3 rounded-full border border-neutral-300 dark:border-(--border-dark-mode) bg-neutral-100/80 dark:bg-white/5 text-neutral-900 dark:text-white text-sm font-bold focus:outline-none focus:border-[#B90101] transition shadow-inner"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !nameInput.trim()}
                className="w-full py-3 px-8 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-sm uppercase tracking-wider transition active:scale-95 shadow-md border border-white/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Creating Squad...</span>
                  </>
                ) : (
                  <span>Create Squad & Get Link</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex justify-center pt-2">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#B90101]/15 dark:bg-[#B90101]/25 border border-[#B90101]/30 flex items-center justify-center shadow-inner backdrop-blur-md">
                <svg
                  className="w-12 h-12 sm:w-14 sm:h-14 text-[#B90101]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl sm:text-3xl font-black text-[#B90101] tracking-tight">
                Link created !
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed">
                Share link for <strong className="text-[#B90101] font-bold">{groupName || "your squad"}</strong>
                <br />
                so your friends can choose their seats.
              </p>
            </div>

        <div
          className="w-full max-w-sm mx-auto flex items-center justify-between gap-3 px-4 py-3 rounded-full border shadow-inner backdrop-blur-md"
          style={{
            backgroundColor: isDark ? "var(--primary-color-30)" : "#f5f5f5",
            borderColor: isDark
              ? "var(--border-dark-mode)"
              : "rgba(39, 42, 48, 0.15)",
          }}
        >
          <span className="font-semibold text-xs sm:text-sm text-[#B90101] truncate select-all pl-1">
            {shareUrl}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-neutral-500 hover:text-[#B90101] dark:text-neutral-400 dark:hover:text-white transition p-1 shrink-0 flex items-center gap-1 cursor-pointer"
            title="Copy link"
          >
            {copied ? (
              <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Copied!
              </span>
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* 4. Share link via label */}
        <div className="pt-1">
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider block">
            Share link via
          </span>
        </div>

        {/* 5. Social Share Icons Row (Telegram, Facebook) */}
        <div className="flex items-center justify-center gap-6 pt-1">
          {/* Telegram */}
          <button
            type="button"
            onClick={() => handleShare("telegram")}
            className="flex flex-col items-center gap-1.5 group cursor-pointer transition active:scale-95"
            title="Share on Telegram"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition flex items-center justify-center">
              <svg
                viewBox="0 0 256 256"
                preserveAspectRatio="xMidYMid"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient
                    id="telegram__a"
                    x1="50%"
                    x2="50%"
                    y1="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#2AABEE" />
                    <stop offset="100%" stopColor="#229ED9" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#telegram__a)"
                  d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51 0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0Z"
                />
                <path
                  fill="#FFF"
                  d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152 35.56-14.786 42.94-17.354 47.76-17.441 1.06-.017 3.42.245 4.96 1.49 1.28 1.05 1.64 2.47 1.82 3.467.16.996.38 3.266.2 5.038-1.92 20.24-10.26 69.356-14.5 92.026-1.78 9.592-5.32 12.808-8.74 13.122-7.44.684-13.08-4.912-20.28-9.63-11.26-7.386-17.62-11.982-28.56-19.188-12.64-8.328-4.44-12.906 2.76-20.386 1.88-1.958 34.64-31.748 35.26-34.45.08-.338.16-1.598-.6-2.262-.74-.666-1.84-.438-2.64-.258-1.14.256-19.12 12.152-54 35.686-5.1 3.508-9.72 5.218-13.88 5.128-4.56-.098-13.36-2.584-19.9-4.708-8-2.606-14.38-3.984-13.82-8.41.28-2.304 3.46-4.662 9.52-7.072Z"
                />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-[#B90101] dark:text-red-400">
              Telegram
            </span>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={() => handleShare("facebook")}
            className="flex flex-col items-center gap-1.5 group cursor-pointer transition active:scale-95"
            title="Share on Facebook"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition flex items-center justify-center">
              <svg viewBox="0 0 666.667 666.667" className="w-full h-full">
                <defs>
                  <clipPath
                    id="facebook_icon__a"
                    clipPathUnits="userSpaceOnUse"
                  >
                    <path d="M0 700h700V0H0Z" />
                  </clipPath>
                </defs>
                <g
                  clipPath="url(#facebook_icon__a)"
                  transform="matrix(1.33333 0 0 -1.33333 -133.333 800)"
                >
                  <path
                    d="M0 0c0 138.071-111.929 250-250 250S-500 138.071-500 0c0-117.245 80.715-215.622 189.606-242.638v166.242h-51.552V0h51.552v32.919c0 85.092 38.508 124.532 122.048 124.532 15.838 0 43.167-3.105 54.347-6.211V81.986c-5.901.621-16.149.932-28.882.932-40.993 0-56.832-15.528-56.832-55.9V0h81.659l-14.028-76.396h-67.631v-171.773C-95.927-233.218 0-127.818 0 0"
                    fill="#0866ff"
                    transform="translate(600 350)"
                  />
                  <path
                    d="m0 0 14.029 76.396H-67.63v27.019c0 40.372 15.838 55.899 56.831 55.899 12.733 0 22.981-.31 28.882-.931v69.253c-11.18 3.106-38.509 6.212-54.347 6.212-83.539 0-122.048-39.441-122.048-124.533V76.396h-51.552V0h51.552v-166.242a250.559 250.559 0 0 1 60.394-7.362c10.254 0 20.358.632 30.288 1.831V0Z"
                    fill="#fff"
                    transform="translate(447.918 273.604)"
                  />
                </g>
              </svg>
            </div>
            <span className="text-[11px] font-bold text-[#B90101] dark:text-red-400">
              Facebook
            </span>
          </button>
        </div>

        <div className="pt-2 w-full max-w-sm mx-auto">
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-3 px-8 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-sm uppercase tracking-wider transition active:scale-95 shadow-md border border-white/20 flex items-center justify-center cursor-pointer"
          >
            Continue
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
}
