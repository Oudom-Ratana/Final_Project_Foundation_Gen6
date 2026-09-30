import { baseApi } from "./baseApi";

export const cinemaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

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

    getCinemaMovieByUuid: builder.query({
      query: (uuid) => `/movies/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Movie", id: uuid }],
    }),

    searchCinemaMovies: builder.query({
      query: (params = {}) => {
        const { query = "", page = 0, size = 20 } = params;
        return `/movies/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`;
      },
      providesTags: ["Movie"],
    }),

    importMovieFromTmdb: builder.mutation({
      query: (tmdbId) => ({
        url: `/movies/import/${tmdbId}`,
        method: "POST",
      }),
      invalidatesTags: ["Movie"],
    }),

    updateMovieStatus: builder.mutation({
      query: ({ uuid, status }) => ({
        url: `/movies/${uuid}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Movie"],
    }),

    deleteMovie: builder.mutation({
      query: (uuid) => ({
        url: `/movies/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Movie", "Showtime"],
    }),


    getAllShowtimes: builder.query({
      query: () => "/showtimes",
      providesTags: ["Showtime"],
    }),

    getShowtimeByUuid: builder.query({
      query: (uuid) => `/showtimes/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Showtime", id: uuid }],
    }),

    getShowtimeSeats: builder.query({
      query: (showtimeUuid) => `/showtimes/${showtimeUuid}/seats`,
      providesTags: (result, error, showtimeUuid) => [
        { type: "Seat", id: showtimeUuid },
        "Seat",
      ],
    }),

    createShowtime: builder.mutation({
      query: (showtimeData) => ({
        url: "/showtimes",
        method: "POST",
        body: showtimeData,
      }),
      invalidatesTags: ["Showtime"],
    }),

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

    releaseHold: builder.mutation({
      query: ({ showtimeUuid, holdId }) => ({
        url: `/showtimes/${showtimeUuid}/holds/${holdId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { showtimeUuid }) => [
        { type: "Seat", id: showtimeUuid },
      ],
    }),


    createBooking: builder.mutation({
      query: ({ showtimeUuid, holdId }) => ({
        url: "/bookings",
        method: "POST",
        body: { showtimeUuid, holdId },
      }),
      invalidatesTags: ["Booking", "Seat"],
    }),

    getBookingByUuid: builder.query({
      query: (uuid) => `/bookings/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Booking", id: uuid }],
    }),

    getMyBookings: builder.query({
      query: (params = {}) => {
        const { page = 0, size = 20 } = params;
        return `/bookings/me?page=${page}&size=${size}`;
      },
      providesTags: ["Booking"],
    }),


    getBookingConcessionOrder: builder.query({
      query: (bookingUuid) => `/bookings/${bookingUuid}/concession-order`,
      providesTags: (result, error, bookingUuid) => [
        { type: "Concession", id: bookingUuid },
      ],
    }),

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


    getEligibleBookings: builder.query({
      query: () => "/concession-orders/eligible-bookings",
      providesTags: ["Booking", "ConcessionOrder"],
    }),

    createPostBookingConcessionOrder: builder.mutation({
      query: ({ bookingUuid, items }) => ({
        url: "/concession-orders",
        method: "POST",
        body: { bookingUuid, items },
      }),
      invalidatesTags: ["ConcessionOrder"],
    }),

    createConcessionPayment: builder.mutation({
      query: (concessionOrderUuid) => ({
        url: `/concession-payments/orders/${concessionOrderUuid}`,
        method: "POST",
      }),
      invalidatesTags: ["ConcessionPayment"],
    }),

    verifyConcessionPayment: builder.mutation({
      query: (paymentUuid) => ({
        url: `/concession-payments/${paymentUuid}/verify`,
        method: "POST",
      }),
      invalidatesTags: [
        "ConcessionPayment",
        "ConcessionInvoice",
        "Concession",
        "ConcessionOrder",
        "Booking",
        "Ticket",
      ],
    }),

    getConcessionInvoice: builder.query({
      query: (orderUuid) => `/concession-invoices/orders/${orderUuid}`,
      providesTags: (result, error, orderUuid) => [
        { type: "ConcessionInvoice", id: orderUuid },
      ],
    }),

    pickupConcession: builder.mutation({
      query: ({ qrToken }) => ({
        url: "/concession-invoices/pickup",
        method: "POST",
        body: { qrToken },
      }),
      invalidatesTags: ["ConcessionInvoice"],
    }),


    getAllConcessions: builder.query({
      query: () => "/concessions",
      providesTags: ["Concession"],
    }),

    getConcessionByUuid: builder.query({
      query: (uuid) => `/concessions/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Concession", id: uuid }],
    }),

    createConcession: builder.mutation({
      query: (concessionData) => ({
        url: "/concessions",
        method: "POST",
        body: concessionData,
      }),
      invalidatesTags: ["Concession"],
    }),

    updateConcession: builder.mutation({
      query: ({ uuid, concessionData }) => ({
        url: `/concessions/${uuid}`,
        method: "PATCH",
        body: concessionData,
      }),
      invalidatesTags: ["Concession"],
    }),

    toggleConcessionStatus: builder.mutation({
      query: (uuid) => ({
        url: `/concessions/${uuid}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Concession"],
    }),

    deleteConcessionPermanently: builder.mutation({
      query: (uuid) => ({
        url: `/concessions/${uuid}/permanent`,
        method: "DELETE",
      }),
      invalidatesTags: ["Concession"],
    }),


    createPayment: builder.mutation({
  query: (bookingUuid) => ({
    url: `/bookings/${bookingUuid}/payments`,
    method: "POST",
  }),
  invalidatesTags: ["Payment", "Booking"],
}),

    getPaymentByUuid: builder.query({
      query: (paymentUuid) => `/payments/${paymentUuid}`,
      providesTags: (result, error, paymentUuid) => [
        { type: "Payment", id: paymentUuid },
      ],
    }),

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

    verifyPayment: builder.mutation({
      query: (paymentUuid) => ({
        url: `/payments/${paymentUuid}/verify`,
        method: "POST",
      }),
      invalidatesTags: ["Payment", "Booking", "Ticket"],
    }),

    getMyPayments: builder.query({
      query: (params = {}) => {
        const { page = 0, size = 20 } = params;
        return `/payments/me?page=${page}&size=${size}`;
      },
      providesTags: ["Payment"],
    }),

    markPaymentSuccess: builder.mutation({
      query: (paymentUuid) => ({
        url: `/payments/${paymentUuid}/success`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payment", "Booking"],
    }),

    markPaymentFailed: builder.mutation({
      query: (paymentUuid) => ({
        url: `/payments/${paymentUuid}/failed`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payment", "Booking"],
    }),


    getMyTickets: builder.query({
      query: (params = {}) => {
        const { page = 0, size = 20 } = params;
        return `/tickets/me?page=${page}&size=${size}`;
      },
      providesTags: ["Ticket"],
    }),

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

    getDigitalTicketByQr: builder.query({
      query: (qrToken) => `/tickets/qr/${qrToken}`,
      providesTags: (result, error, qrToken) => [
        { type: "Ticket", id: qrToken },
      ],
    }),


    getAllHalls: builder.query({
      query: () => "/halls",
      providesTags: ["Hall"],
    }),

    getHallByUuid: builder.query({
      query: (uuid) => `/halls/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Hall", id: uuid }],
    }),

    createHall: builder.mutation({
      query: (hallData) => ({
        url: "/halls",
        method: "POST",
        body: hallData,
      }),
      invalidatesTags: ["Hall"],
    }),

    updateHallCapacity: builder.mutation({
      query: ({ uuid, capacity }) => ({
        url: `/halls/${uuid}`,
        method: "PATCH",
        body: { capacity },
      }),
      invalidatesTags: ["Hall"],
    }),

    updateHallStatus: builder.mutation({
      query: ({ uuid, status }) => ({
        url: `/halls/${uuid}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Hall"],
    }),

    deleteHall: builder.mutation({
      query: (uuid) => ({
        url: `/halls/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hall"],
    }),


    getSeatsByHall: builder.query({
      query: (hallUuid) => `/halls/${hallUuid}/seats`,
      providesTags: (result, error, hallUuid) => [
        { type: "Seat", id: hallUuid },
      ],
    }),

    createSeat: builder.mutation({
      query: ({ hallUuid, seatData }) => ({
        url: `/halls/${hallUuid}/seats`,
        method: "POST",
        body: seatData,
      }),
      invalidatesTags: ["Seat", "Hall"],
    }),

    createCoupleSeat: builder.mutation({
      query: ({ hallUuid, coupleData }) => ({
        url: `/halls/${hallUuid}/seats/couple`,
        method: "POST",
        body: coupleData,
      }),
      invalidatesTags: ["Seat", "Hall"],
    }),

    createSeatsBulk: builder.mutation({
      query: ({ hallUuid, rows }) => ({
        url: `/halls/${hallUuid}/seats/bulk`,
        method: "POST",
        body: { rows },
      }),
      invalidatesTags: ["Seat", "Hall"],
    }),

    getSeatByUuid: builder.query({
      query: (uuid) => `/seats/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Seat", id: uuid }],
    }),

    updateSeatStatus: builder.mutation({
      query: ({ uuid, status }) => ({
        url: `/seats/${uuid}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Seat"],
    }),


    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/files/images",
        method: "POST",
        body: formData,
      }),
    }),


    createGroupBooking: builder.mutation({
      query: (data) => ({
        url: "/group-bookings",
        method: "POST",
        body: data, 
      }),
      invalidatesTags: ["GroupBooking"],
    }),

    getGroupInvitation: builder.query({
      query: (inviteToken) => `/group-bookings/invitations/${inviteToken}`,
      providesTags: (result, error, inviteToken) => [
        { type: "GroupBooking", id: `INVITE_${inviteToken}` },
      ],
    }),

    joinGroupBooking: builder.mutation({
      query: (inviteToken) => ({
        url: `/group-bookings/join/${inviteToken}`,
        method: "POST",
      }),
      invalidatesTags: ["GroupBooking"],
    }),

    getGroupBookingByUuid: builder.query({
      query: (groupUuid) => `/group-bookings/${groupUuid}`,
      providesTags: (result, error, groupUuid) => [
        { type: "GroupBooking", id: groupUuid },
      ],
    }),

    getGroupMembers: builder.query({
      query: (groupUuid) => `/group-bookings/${groupUuid}/members`,
      providesTags: (result, error, groupUuid) => [
        { type: "GroupBooking", id: `${groupUuid}_MEMBERS` },
      ],
    }),

    attachMemberBooking: builder.mutation({
      query: ({ groupUuid, bookingUuid }) => ({
        url: `/group-bookings/${groupUuid}/members/me/booking/${bookingUuid}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { groupUuid }) => [
        { type: "GroupBooking", id: groupUuid },
        { type: "GroupBooking", id: `${groupUuid}_MEMBERS` },
      ],
    }),

    markMemberReady: builder.mutation({
      query: (groupUuid) => ({
        url: `/group-bookings/${groupUuid}/members/me/ready`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, groupUuid) => [
        { type: "GroupBooking", id: groupUuid },
        { type: "GroupBooking", id: `${groupUuid}_MEMBERS` },
      ],
    }),

    markMemberSelecting: builder.mutation({
      query: (groupUuid) => ({
        url: `/group-bookings/${groupUuid}/members/me/selecting`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, groupUuid) => [
        { type: "GroupBooking", id: groupUuid },
        { type: "GroupBooking", id: `${groupUuid}_MEMBERS` },
      ],
    }),

    lockGroupBooking: builder.mutation({
      query: (groupUuid) => ({
        url: `/group-bookings/${groupUuid}/lock`,
        method: "POST",
      }),
      invalidatesTags: (result, error, groupUuid) => [
        { type: "GroupBooking", id: groupUuid },
        { type: "GroupBooking", id: `${groupUuid}_MEMBERS` },
      ],
    }),


    createGroupPayment: builder.mutation({
      query: (groupUuid) => ({
        url: `/group-bookings/${groupUuid}/payments`,
        method: "POST",
      }),
      invalidatesTags: (result, error, groupUuid) => [
        { type: "GroupBooking", id: groupUuid },
        "GroupPayment",
      ],
    }),

    getGroupPaymentByUuid: builder.query({
      query: (paymentUuid) => `/group-payments/${paymentUuid}`,
      providesTags: (result, error, paymentUuid) => [
        { type: "GroupPayment", id: paymentUuid },
      ],
    }),

    getGroupPaymentQr: builder.query({
      query: (paymentUuid) => ({
        url: `/group-payments/${paymentUuid}/qr`,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        },
      }),
      providesTags: (result, error, paymentUuid) => [
        { type: "GroupPayment", id: `${paymentUuid}_QR` },
      ],
    }),

    verifyGroupPayment: builder.mutation({
      query: (paymentUuid) => ({
        url: `/group-payments/${paymentUuid}/verify`,
        method: "POST",
      }),
      invalidatesTags: ["GroupBooking", "GroupPayment", "Booking", "Ticket"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCinemaMoviesQuery,
  useLazyGetCinemaMoviesQuery,
  useGetCinemaMovieByUuidQuery,
  useLazyGetCinemaMovieByUuidQuery,
  useSearchCinemaMoviesQuery,
  useLazySearchCinemaMoviesQuery,
  useImportMovieFromTmdbMutation,
  useUpdateMovieStatusMutation,
  useDeleteMovieMutation,

  useGetAllShowtimesQuery,
  useLazyGetAllShowtimesQuery,
  useGetShowtimeByUuidQuery,
  useLazyGetShowtimeByUuidQuery,
  useGetShowtimeSeatsQuery,
  useLazyGetShowtimeSeatsQuery,
  useCreateShowtimeMutation,
  useHoldSeatsMutation,
  useReleaseHoldMutation,

  useCreateBookingMutation,
  useGetBookingByUuidQuery,
  useLazyGetBookingByUuidQuery,
  useGetMyBookingsQuery,
  useLazyGetMyBookingsQuery,

  useGetBookingConcessionOrderQuery,
  useLazyGetBookingConcessionOrderQuery,
  useUpsertBookingConcessionOrderMutation,
  useRemoveBookingConcessionOrderMutation,

  useGetEligibleBookingsQuery,
  useLazyGetEligibleBookingsQuery,
  useCreatePostBookingConcessionOrderMutation,
  useCreateConcessionPaymentMutation,
  useVerifyConcessionPaymentMutation,
  useGetConcessionInvoiceQuery,
  useLazyGetConcessionInvoiceQuery,
  usePickupConcessionMutation,

  useGetAllConcessionsQuery,
  useLazyGetAllConcessionsQuery,
  useGetConcessionByUuidQuery,
  useLazyGetConcessionByUuidQuery,
  useCreateConcessionMutation,
  useUpdateConcessionMutation,
  useToggleConcessionStatusMutation,
  useDeleteConcessionPermanentlyMutation,

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

  useGetMyTicketsQuery,
  useLazyGetMyTicketsQuery,
  useGetBookingQrCodeQuery,
  useLazyGetBookingQrCodeQuery,
  useGetDigitalTicketByQrQuery,
  useLazyGetDigitalTicketByQrQuery,

  useGetAllHallsQuery,
  useLazyGetAllHallsQuery,
  useGetHallByUuidQuery,
  useLazyGetHallByUuidQuery,
  useCreateHallMutation,
  useUpdateHallCapacityMutation,
  useUpdateHallStatusMutation,
  useDeleteHallMutation,

  useGetSeatsByHallQuery,
  useLazyGetSeatsByHallQuery,
  useCreateSeatMutation,
  useCreateCoupleSeatMutation,
  useCreateSeatsBulkMutation,
  useGetSeatByUuidQuery,
  useLazyGetSeatByUuidQuery,
  useUpdateSeatStatusMutation,

  useUploadImageMutation,

  useCreateGroupBookingMutation,
  useGetGroupInvitationQuery,
  useLazyGetGroupInvitationQuery,
  useJoinGroupBookingMutation,
  useGetGroupBookingByUuidQuery,
  useLazyGetGroupBookingByUuidQuery,
  useGetGroupMembersQuery,
  useLazyGetGroupMembersQuery,
  useAttachMemberBookingMutation,
  useMarkMemberReadyMutation,
  useMarkMemberSelectingMutation,
  useLockGroupBookingMutation,

  useCreateGroupPaymentMutation,
  useGetGroupPaymentByUuidQuery,
  useLazyGetGroupPaymentByUuidQuery,
  useGetGroupPaymentQrQuery,
  useLazyGetGroupPaymentQrQuery,
  useVerifyGroupPaymentMutation,
} = cinemaApi;
