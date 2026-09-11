/**
 * cinemaShowtimeData.js
 * Cinema branches and showtime schedules for ticket booking
 */

export const LOCATIONS = [
  "All Locations",
  "FilmZone SenSok",
  "FilmZone Eden Garden",
  "FilmZone MeanChey",
  "FilmZone Aeon Mall SenSok",
  "FilmZone Toul Kork",
];

export const DATES = [
  { id: "2026-08-25", month: "Aug", day: "25", weekday: "Tue" },
  { id: "2026-08-26", month: "Aug", day: "26", weekday: "Tue" },
  { id: "2026-08-27", month: "Aug", day: "27", weekday: "Tue" },
  { id: "2026-08-28", month: "Aug", day: "28", weekday: "Wed" },
  { id: "2026-08-29", month: "Aug", day: "29", weekday: "Thu" },
];

export const BRANCH_SHOWTIMES = [
  {
    id: "sensok-hall-4",
    branchName: "FilmZone SenSok",
    hall: "Hall 4 - Gold Class VIP",
    location: "FilmZone SenSok",
    goldClass: true,
    realD3D: false,
    subtitle: "KH",
    audio: "EN",
    screenType: null,
    times: ["09:00 PM", "12:45 PM", "03:45 PM"],
  },
  {
    id: "sensok-hall-3",
    branchName: "FilmZone SenSok",
    hall: "Hall 3 - ScreenX 270°",
    location: "FilmZone SenSok",
    goldClass: true,
    realD3D: false,
    subtitle: "KH",
    audio: "EN",
    screenType: "SCREEN X",
    times: ["09:00 PM", "12:45 PM", "03:45 PM"],
  },
  {
    id: "sensok-hall-2",
    branchName: "FilmZone SenSok",
    hall: "Hall 2 - 3D RealD Laser",
    location: "FilmZone SenSok",
    goldClass: false,
    realD3D: true,
    subtitle: "KH",
    audio: "EN",
    screenType: null,
    times: ["09:00 PM", "12:45 PM", "03:45 PM"],
  },
  {
    id: "sensok-hall-1",
    branchName: "FilmZone SenSok",
    hall: "Hall 1 - Standard 2D",
    location: "FilmZone SenSok",
    goldClass: false,
    realD3D: false,
    subtitle: "KH",
    audio: "EN",
    screenType: "SCREEN 2D",
    times: ["09:00 PM", "12:45 PM", "03:45 PM"],
  },
  {
    id: "eden-hall-2",
    branchName: "FilmZone Eden Garden",
    hall: "Hall 2 - Gold Class VIP",
    location: "FilmZone Eden Garden",
    goldClass: true,
    realD3D: false,
    subtitle: "KH",
    audio: "EN",
    screenType: null,
    times: ["01:00 PM", "05:30 PM", "09:15 PM"],
  },
  {
    id: "eden-hall-1",
    branchName: "FilmZone Eden Garden",
    hall: "Hall 1 - Standard 2D",
    location: "FilmZone Eden Garden",
    goldClass: false,
    realD3D: false,
    subtitle: "KH",
    audio: "EN",
    screenType: "SCREEN 2D",
    times: ["11:00 AM", "02:30 PM", "06:00 PM", "08:45 PM"],
  },
];
