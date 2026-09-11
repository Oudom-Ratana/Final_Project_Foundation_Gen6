/**
 * SeatIcon.jsx
 * Custom cinema armchair SVG matching the exact shape in the design mockups:
 * - Available (Grey: #A8A8A8)
 * - Selected (Golden Yellow: #FFD700)
 * - Reserved (Crimson Red: #B90101)
 */
export default function SeatIcon({
  status = "available", // 'available' | 'selected' | 'reserved'
  isCouple = false,
  className = "",
  size = 36,
}) {
  // Color mapping based on design mockups
  const fillColors = {
    available: "#9CA3AF",
    selected: "#FFD700",
    reserved: "#B90101",
  };

  const fillColor = fillColors[status] || fillColors.available;

  if (isCouple) {
    return (
      <svg
        width={size * 1.85}
        height={size}
        viewBox="0 0 76 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-transform duration-150 ${className}`}
      >
        {/* Left Seat Backrest */}
        <rect x="7" y="4" width="26" height="22" rx="5" fill={fillColor} />
        {/* Right Seat Backrest */}
        <rect x="43" y="4" width="26" height="22" rx="5" fill={fillColor} />
        {/* Left Armrest */}
        <rect x="2" y="15" width="6" height="21" rx="3" fill={fillColor} />
        {/* Center Shared Armrest */}
        <rect x="35" y="15" width="6" height="21" rx="3" fill={fillColor} />
        {/* Right Armrest */}
        <rect x="68" y="15" width="6" height="21" rx="3" fill={fillColor} />
        {/* Connected Cushion */}
        <rect x="6" y="23" width="64" height="14" rx="4" fill={fillColor} />
        {/* Legs / Base */}
        <rect x="14" y="37" width="5" height="4" rx="1.5" fill={fillColor} opacity="0.8" />
        <rect x="57" y="37" width="5" height="4" rx="1.5" fill={fillColor} opacity="0.8" />
      </svg>
    );
  }

  // Single Seat SVG
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-150 ${className}`}
    >
      {/* Backrest */}
      <rect x="8" y="4" width="26" height="22" rx="5" fill={fillColor} />
      {/* Left Armrest */}
      <rect x="2" y="15" width="6" height="21" rx="3" fill={fillColor} />
      {/* Right Armrest */}
      <rect x="34" y="15" width="6" height="21" rx="3" fill={fillColor} />
      {/* Seat Cushion */}
      <rect x="7" y="23" width="28" height="14" rx="4" fill={fillColor} />
      {/* Base Legs */}
      <rect x="12" y="37" width="4" height="4" rx="1.5" fill={fillColor} opacity="0.8" />
      <rect x="26" y="37" width="4" height="4" rx="1.5" fill={fillColor} opacity="0.8" />
    </svg>
  );
}
