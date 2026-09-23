import { baseApi } from "./baseApi";

export const cinemaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // 1. MOVIES (movie-controller)
    // ==========================================

    // Customer & Admin: Get all movies with pagination & sorting
    getCinemaMovies: builder.query({
      query: (params = {}) => {
        const {
          page = 0,
          size = 20,
          sortBy = "createdAt",
          direction = "desc",
        } = params;
        return {
          url: `/movies?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
        };
      },
      providesTags: ["Movie"],
    }),

    // Customer & Admin: Get movie by UUID
    getCinemaMovieByUuid: builder.query({
      query: (uuid) => `/movies/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Movie", id: uuid }],
    }),

    // Search movies in database
    searchCinemaMovies: builder.query({
      query: (params = {}) => {
        const { query = "", page = 0, size = 20 } = params;
        return `/movies/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`;
      },
      providesTags: ["Movie"],
    }),

    // Admin: Import a movie from TMDB into Cinema database
    importMovieFromTmdb: builder.mutation({
      query: (tmdbId) => ({
        url: `/movies/import/${tmdbId}`,
        method: "POST",
      }),
      invalidatesTags: ["Movie"],
    }),

    // Admin: Update movie status (ACTIVE, INACTIVE, COMING_SOON, ARCHIVED)
    updateMovieStatus: builder.mutation({
      query: ({ uuid, status }) => ({
        url: `/movies/${uuid}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Movie"],
    }),

    // Admin: Delete a movie from database
    deleteMovie: builder.mutation({
      query: (uuid) => ({
        url: `/movies/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Movie", "Showtime"],
    }),

    // ==========================================
    // 2. SHOWTIMES & SEAT HOLDS (showtime & seat-hold-controller)
    // ==========================================

    // Customer & Admin: Get all showtimes
    getAllShowtimes: builder.query({
      query: () => "/showtimes",
      providesTags: ["Showtime"],
    }),

    // Customer & Admin: Get showtime by UUID
    getShowtimeByUuid: builder.query({
      query: (uuid) => `/showtimes/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Showtime", id: uuid }],
    }),

    // Customer: Get real-time seat availability for a specific showtime
    getShowtimeSeats: builder.query({
      query: (showtimeUuid) => `/showtimes/${showtimeUuid}/seats`,
      providesTags: (result, error, showtimeUuid) => [
        { type: "Seat", id: showtimeUuid },
      ],
    }),

    // Admin: Create a new showtime
    createShowtime: builder.mutation({
      query: (showtimeData) => ({
        url: "/showtimes",
        method: "POST",
        body: showtimeData,
      }),
      invalidatesTags: ["Showtime"],
    }),

    // Customer: Hold selected seats for checkout countdown
    holdSeats: builder.mutation({
      query: ({ showtimeUuid, seatUuids }) => ({
        url: `/showtimes/${showtimeUuid}/holds`,
        method: "POST",
        body: { seatUuids },
      }),
      invalidatesTags: (result, error, { showtimeUuid }) => [
        { type: "Seat", id: showtimeUuid },
      ],
    }),

    // Customer: Release seat hold if cancelled or timed out
    releaseHold: builder.mutation({
      query: ({ showtimeUuid, holdId }) => ({
        url: `/showtimes/${showtimeUuid}/holds/${holdId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { showtimeUuid }) => [
        { type: "Seat", id: showtimeUuid },
      ],
    }),

    // ==========================================
    // 3. BOOKINGS (booking-controller)
    // ==========================================

    // Customer: Create official booking from hold
    createBooking: builder.mutation({
      query: ({ showtimeUuid, holdId }) => ({
        url: "/bookings",
        method: "POST",
        body: { showtimeUuid, holdId },
      }),
      invalidatesTags: ["Booking", "Seat"],
    }),

    // Customer: Get booking by UUID
    getBookingByUuid: builder.query({
      query: (uuid) => `/bookings/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Booking", id: uuid }],
    }),

    // Customer: Get my bookings history (/api/v1/bookings/me)
    getMyBookings: builder.query({
      query: (params = {}) => {
        const { page = 0, size = 20 } = params;
        return `/bookings/me?page=${page}&size=${size}`;
      },
      providesTags: ["Booking"],
    }),

    // ==========================================
    // 4. BOOKING CONCESSION ORDERS (booking-concession-controller)
    // ==========================================

    // Get concessions ordered for a booking
    getBookingConcessionOrder: builder.query({
      query: (bookingUuid) => `/bookings/${bookingUuid}/concession-order`,
      providesTags: (result, error, bookingUuid) => [
        { type: "Concession", id: bookingUuid },
      ],
    }),

    // Add or update concessions for a booking (items: [{ concessionItemUuid, quantity }])
    upsertBookingConcessionOrder: builder.mutation({
      query: ({ bookingUuid, items }) => ({
        url: `/bookings/${bookingUuid}/concession-order`,
        method: "PUT",
        body: { items },
      }),
      invalidatesTags: (result, error, { bookingUuid }) => [
        { type: "Concession", id: bookingUuid },
        { type: "Booking", id: bookingUuid },
      ],
    }),

    // Remove concession order from a booking
    removeBookingConcessionOrder: builder.mutation({
      query: (bookingUuid) => ({
        url: `/bookings/${bookingUuid}/concession-order`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, bookingUuid) => [
        { type: "Concession", id: bookingUuid },
        { type: "Booking", id: bookingUuid },
      ],
    }),

    // ==========================================
    // 5. CONCESSIONS CATALOG (concession-controller)
    // ==========================================

    // Customer & Admin: Get all concessions (popcorn, drinks, combos)
    getAllConcessions: builder.query({
      query: () => "/concessions",
      providesTags: ["Concession"],
    }),

    // Get concession by UUID
    getConcessionByUuid: builder.query({
      query: (uuid) => `/concessions/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Concession", id: uuid }],
    }),

    // Admin: Create a new concession item
    createConcession: builder.mutation({
      query: (concessionData) => ({
        url: "/concessions",
        method: "POST",
        body: concessionData,
      }),
      invalidatesTags: ["Concession"],
    }),

    // Admin: Update concession details
    updateConcession: builder.mutation({
      query: ({ uuid, concessionData }) => ({
        url: `/concessions/${uuid}`,
        method: "PATCH",
        body: concessionData,
      }),
      invalidatesTags: ["Concession"],
    }),

    // Admin: Toggle concession active status
    toggleConcessionStatus: builder.mutation({
      query: (uuid) => ({
        url: `/concessions/${uuid}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Concession"],
    }),

    // Admin: Permanently delete a concession
    deleteConcessionPermanently: builder.mutation({
      query: (uuid) => ({
        url: `/concessions/${uuid}/permanent`,
        method: "DELETE",
      }),
      invalidatesTags: ["Concession"],
    }),

    // ==========================================
    // 6. PAYMENTS & BAKONG KHQR (payment-controller)
    // ==========================================

    // Create payment order for a booking (path param bookingUuid)
    createPayment: builder.mutation({
  query: (bookingUuid) => ({
    url: `/bookings/${bookingUuid}/payments`,
    method: "POST",
  }),
  invalidatesTags: ["Payment", "Booking"],
}),

    // Get payment details by payment UUID
    getPaymentByUuid: builder.query({
      query: (paymentUuid) => `/payments/${paymentUuid}`,
      providesTags: (result, error, paymentUuid) => [
        { type: "Payment", id: paymentUuid },
      ],
    }),

    // Get Bakong KHQR QR Code PNG image for payment (returns browser blob URL)
    getPaymentQr: builder.query({
      query: (paymentUuid) => ({
        url: `/payments/${paymentUuid}/qr`,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        },
      }),
      providesTags: (result, error, paymentUuid) => [
        { type: "Payment", id: paymentUuid },
      ],
    }),

    // Customer: Verify payment completion after scan
    verifyPayment: builder.mutation({
      query: (paymentUuid) => ({
        url: `/payments/${paymentUuid}/verify`,
        method: "POST",
      }),
      invalidatesTags: ["Payment", "Booking", "Ticket"],
    }),

    // Customer: Get my payment history
    getMyPayments: builder.query({
      query: (params = {}) => {
        const { page = 0, size = 20 } = params;
        return `/payments/me?page=${page}&size=${size}`;
      },
      providesTags: ["Payment"],
    }),

    // Admin: Mark payment as SUCCESS
    markPaymentSuccess: builder.mutation({
      query: (paymentUuid) => ({
        url: `/payments/${paymentUuid}/success`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payment", "Booking"],
    }),

    // Admin: Mark payment as FAILED
    markPaymentFailed: builder.mutation({
      query: (paymentUuid) => ({
        url: `/payments/${paymentUuid}/failed`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payment", "Booking"],
    }),

    // ==========================================
    // 7. TICKETS & QR VALIDATION (ticket-controller)
    // ==========================================

    // Customer: Get my digital cinema tickets
    getMyTickets: builder.query({
      query: (params = {}) => {
        const { page = 0, size = 20 } = params;
        return `/tickets/me?page=${page}&size=${size}`;
      },
      providesTags: ["Ticket"],
    }),

    // Get booking scannable QR code (authenticated PNG blob)
    getBookingQrCode: builder.query({
      query: (bookingUuid) => ({
        url: `/tickets/bookings/${bookingUuid}/qr`,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        },
      }),
      providesTags: (result, error, bookingUuid) => [
        { type: "Ticket", id: bookingUuid },
      ],
    }),

    // Cinema Door Scanner: Get digital ticket by QR token
    getDigitalTicketByQr: builder.query({
      query: (qrToken) => `/tickets/qr/${qrToken}`,
      providesTags: (result, error, qrToken) => [
        { type: "Ticket", id: qrToken },
      ],
    }),

    // ==========================================
    // 8. HALLS (hall-controller)
    // ==========================================

    // Get all cinema halls
    getAllHalls: builder.query({
      query: () => "/halls",
      providesTags: ["Hall"],
    }),

    // Get single hall by UUID
    getHallByUuid: builder.query({
      query: (uuid) => `/halls/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Hall", id: uuid }],
    }),

    // Admin: Create a new cinema hall
    createHall: builder.mutation({
      query: (hallData) => ({
        url: "/halls",
        method: "POST",
        body: hallData,
      }),
      invalidatesTags: ["Hall"],
    }),

    // Admin: Update hall capacity
    updateHallCapacity: builder.mutation({
      query: ({ uuid, capacity }) => ({
        url: `/halls/${uuid}`,
        method: "PATCH",
        body: { capacity },
      }),
      invalidatesTags: ["Hall"],
    }),

    // Admin: Update hall status (ACTIVE, MAINTENANCE, INACTIVE)
    updateHallStatus: builder.mutation({
      query: ({ uuid, status }) => ({
        url: `/halls/${uuid}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Hall"],
    }),

    // Admin: Delete a cinema hall
    deleteHall: builder.mutation({
      query: (uuid) => ({
        url: `/halls/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hall"],
    }),

    // ==========================================
    // 9. SEATS (seat-controller)
    // ==========================================

    // Get all seats configured in a hall
    getSeatsByHall: builder.query({
      query: (hallUuid) => `/halls/${hallUuid}/seats`,
      providesTags: (result, error, hallUuid) => [
        { type: "Seat", id: hallUuid },
      ],
    }),

    // Admin: Create single seat in a hall
    createSeat: builder.mutation({
      query: ({ hallUuid, seatData }) => ({
        url: `/halls/${hallUuid}/seats`,
        method: "POST",
        body: seatData,
      }),
      invalidatesTags: ["Seat", "Hall"],
    }),

    // Admin: Create couple seat pair in a hall
    createCoupleSeat: builder.mutation({
      query: ({ hallUuid, coupleData }) => ({
        url: `/halls/${hallUuid}/seats/couple`,
        method: "POST",
        body: coupleData,
      }),
      invalidatesTags: ["Seat", "Hall"],
    }),

    // Admin: Bulk generate seats for a hall
    createSeatsBulk: builder.mutation({
      query: ({ hallUuid, rows }) => ({
        url: `/halls/${hallUuid}/seats/bulk`,
        method: "POST",
        body: { rows },
      }),
      invalidatesTags: ["Seat", "Hall"],
    }),

    // Get seat details by UUID
    getSeatByUuid: builder.query({
      query: (uuid) => `/seats/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Seat", id: uuid }],
    }),

    // Admin: Update seat status (ACTIVE, INACTIVE, MAINTENANCE)
    updateSeatStatus: builder.mutation({
      query: ({ uuid, status }) => ({
        url: `/seats/${uuid}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Seat"],
    }),

    // ==========================================
    // 10. FILE UPLOADS (file-controller)
    // ==========================================

    // Admin: Upload image file (returns image URL on teacher server)
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/files/images",
        method: "POST",
        body: formData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  // 1. Movies
  useGetCinemaMoviesQuery,
  useLazyGetCinemaMoviesQuery,
  useGetCinemaMovieByUuidQuery,
  useLazyGetCinemaMovieByUuidQuery,
  useSearchCinemaMoviesQuery,
  useLazySearchCinemaMoviesQuery,
  useImportMovieFromTmdbMutation,
  useUpdateMovieStatusMutation,
  useDeleteMovieMutation,

  // 2. Showtimes & Holds
  useGetAllShowtimesQuery,
  useLazyGetAllShowtimesQuery,
  useGetShowtimeByUuidQuery,
  useLazyGetShowtimeByUuidQuery,
  useGetShowtimeSeatsQuery,
  useLazyGetShowtimeSeatsQuery,
  useCreateShowtimeMutation,
  useHoldSeatsMutation,
  useReleaseHoldMutation,

  // 3. Bookings
  useCreateBookingMutation,
  useGetBookingByUuidQuery,
  useLazyGetBookingByUuidQuery,
  useGetMyBookingsQuery,
  useLazyGetMyBookingsQuery,

  // 4. Booking Concession Orders
  useGetBookingConcessionOrderQuery,
  useLazyGetBookingConcessionOrderQuery,
  useUpsertBookingConcessionOrderMutation,
  useRemoveBookingConcessionOrderMutation,

  // 5. Concessions Catalog
  useGetAllConcessionsQuery,
  useLazyGetAllConcessionsQuery,
  useGetConcessionByUuidQuery,
  useLazyGetConcessionByUuidQuery,
  useCreateConcessionMutation,
  useUpdateConcessionMutation,
  useToggleConcessionStatusMutation,
  useDeleteConcessionPermanentlyMutation,

  // 6. Payments & KHQR
  useCreatePaymentMutation,
  useGetPaymentByUuidQuery,
  useLazyGetPaymentByUuidQuery,
  useGetPaymentQrQuery,
  useLazyGetPaymentQrQuery,
  useVerifyPaymentMutation,
  useGetMyPaymentsQuery,
  useLazyGetMyPaymentsQuery,
  useMarkPaymentSuccessMutation,
  useMarkPaymentFailedMutation,

  // 7. Tickets
  useGetMyTicketsQuery,
  useLazyGetMyTicketsQuery,
  useGetBookingQrCodeQuery,
  useLazyGetBookingQrCodeQuery,
  useGetDigitalTicketByQrQuery,
  useLazyGetDigitalTicketByQrQuery,

  // 8. Halls
  useGetAllHallsQuery,
  useLazyGetAllHallsQuery,
  useGetHallByUuidQuery,
  useLazyGetHallByUuidQuery,
  useCreateHallMutation,
  useUpdateHallCapacityMutation,
  useUpdateHallStatusMutation,
  useDeleteHallMutation,

  // 9. Seats
  useGetSeatsByHallQuery,
  useLazyGetSeatsByHallQuery,
  useCreateSeatMutation,
  useCreateCoupleSeatMutation,
  useCreateSeatsBulkMutation,
  useGetSeatByUuidQuery,
  useLazyGetSeatByUuidQuery,
  useUpdateSeatStatusMutation,

  // 10. Files
  useUploadImageMutation,
} = cinemaApi;
