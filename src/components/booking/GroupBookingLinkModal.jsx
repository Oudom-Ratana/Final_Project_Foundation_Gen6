import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { X, Copy, Check, Users } from "lucide-react";
import { selectTheme } from "../../redux/slices/uiSlice";

/**
 * GroupBookingLinkModal
 * Popup shown when user chooses "Group Booking" so they can copy and share
 * the group invitation link with their friends.
 *
 * Fully respects project Glassmorphism tokens:
 * Light Mode: --primary-color-5 & --border-light-mode
 * Dark Mode:  --primary-color-30 & --border-dark-mode
 *
 * Hides Navbar completely while open and mounts via Portal to document.body
 */
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

  // Close modal on Escape key & Hide Navbar completely while modal is open
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



  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-white dark:bg-[var(--primary-color-30)] backdrop-blur-md animate-fadeIn select-none font-sans"
      onClick={onClose}
    >
      {/* Modal Card with exact Glassmorphism specification:
          Light Mode: var(--primary-color-5) + var(--border-light-mode)
          Dark Mode:  var(--primary-color-30) + var(--border-dark-mode)
      */}
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
        {/* Top-Right Red Close 'X' Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#B90101] hover:scale-110 active:scale-95 transition p-1 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {!hasToken ? (
          /* Step 1: Input Squad Name */
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
          /* Step 2: Link Created */
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

        {/* 3. Rounded Pill Link Input with Copy Icon (Uses Glassmorphism tokens) */}
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

        {/* 6. User-requested Continue Button */}
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
