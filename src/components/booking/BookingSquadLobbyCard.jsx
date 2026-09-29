import { Users } from "lucide-react";

export default function BookingSquadLobbyCard({
  groupBooking = null,
  groupMembers = [],
  isHost = false,
  isMyReady = false,
  readyCount = 0,
  totalMemberCount = 1,
  handleEditSelection,
  isMarkingSelecting = false,
  glassCardStyle = {},
}) {
  return (
    <div
      className="w-full rounded-2xl sm:rounded-3xl border p-4 shadow-sm backdrop-blur-md space-y-2.5"
      style={glassCardStyle}
    >
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#B90101]">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5" />
          <span>Squad Lobby ({groupBooking?.name ?? "FilmZone Squad"})</span>
        </div>
        <span>{readyCount} / {totalMemberCount} Ready</span>
      </div>

      {!isHost && isMyReady ? (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>You are READY! Waiting for Host to pay...</span>
          </div>
          <button
            type="button"
            onClick={handleEditSelection}
            disabled={isMarkingSelecting}
            className="text-[11px] font-extrabold underline hover:opacity-80 cursor-pointer"
          >
            Edit Snacks
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {groupMembers.map((m, idx) => {
            const isReady = m.status === "READY";
            const mName = m.firstName
              ? `${m.firstName} ${m.lastName ?? ""}`.trim()
              : `Friend ${idx + 1}`;
            return (
              <span
                key={m.uuid ?? idx}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  isReady
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isReady ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
                <span>{mName}: {isReady ? "READY" : "SELECTING"}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}