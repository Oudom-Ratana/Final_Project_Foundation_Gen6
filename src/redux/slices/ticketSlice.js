import { createSlice } from "@reduxjs/toolkit";
import { MOCK_TICKETS } from "../../data/ticketData";

const STORAGE_KEY = "filmzone_booked_tickets";

// Load user-booked tickets from localStorage
const loadInitialTickets = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState = {
  userTickets: loadInitialTickets(),
};

export const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    addTicket: (state, action) => {
      const newTicket = action.payload;
      if (!newTicket || !newTicket.id) return;

      // Prevent duplicate entry by ticket ID
      const exists = state.userTickets.some((t) => t.id === newTicket.id);
      if (!exists) {
        state.userTickets.unshift(newTicket);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.userTickets));
        } catch (e) {
          console.error("Failed to persist booked ticket to localStorage", e);
        }
      }
    },
    clearAllUserTickets: (state) => {
      state.userTickets = [];
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error("Failed to clear booked tickets from localStorage", e);
      }
    },
  },
});

export const { addTicket, clearAllUserTickets } = ticketSlice.actions;

export const selectUserTickets = (state) => state.tickets.userTickets;
export const selectAllTickets = (state) => [
  ...state.tickets.userTickets,
  ...MOCK_TICKETS,
];

export default ticketSlice.reducer;
