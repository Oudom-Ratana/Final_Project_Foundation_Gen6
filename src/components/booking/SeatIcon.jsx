/**
 * SeatIcon.jsx
 * Cinema armchair SVG matching the Lucide armchair icon from Figma:
 * - Available (Grey: #A3A3A3)
 * - Selected (Golden Yellow: #FFD700)
 * - Reserved (Crimson Red: #B90101)
 */
export default function SeatIcon({
  status = "available", // 'available' | 'selected' | 'reserved'
  size = 28,
  className = "",
}) {
  const colors = {
    available: "#A3A3A3",
    selected: "#FFD700",
    reserved: "#B90101",
  };

  const color = colors[status] || colors.available;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-armchair inline-block transition-transform duration-150 ${className}`}
    >
      <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
      <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z" />
      <path d="M5 18v2" />
      <path d="M19 18v2" />
    </svg>
  );
}
