/**
 * Operations dashboard fixtures.
 *
 * The site has no backend yet, so every figure below is mock data shaped like the API the
 * admin will eventually read. Totals are derived, never hardcoded, so swapping this file
 * for a fetch keeps every header count correct.
 */

export type Kpi = {
  label: string;
  value: number;
  /** Rendered small and raised after the value, e.g. the % on approval rate. */
  suffix?: string;
  /** One decimal place for rates, none for counts. */
  decimals?: number;
  icon: "file" | "eye" | "trend" | "briefcase";
  delta?: string;
};

export const KPIS: Kpi[] = [
  { label: "Applications today", value: 3, icon: "file", delta: "+3 vs yesterday" },
  { label: "In review", value: 27, icon: "eye" },
  { label: "Approval rate", value: 3.0, suffix: "%", decimals: 1, icon: "trend" },
  { label: "Total applications", value: 133, icon: "briefcase" },
];

/** Last 14 days of intake, oldest first. `day` is the day-of-month label on the axis. */
export const VOLUME: { day: string; count: number }[] = [
  { day: "05", count: 8 },
  { day: "06", count: 1 },
  { day: "07", count: 6 },
  { day: "08", count: 0 },
  { day: "09", count: 0 },
  { day: "10", count: 12 },
  { day: "11", count: 14 },
  { day: "12", count: 38 },
  { day: "13", count: 10 },
  { day: "14", count: 23 },
  { day: "15", count: 0 },
  { day: "16", count: 0 },
  { day: "17", count: 0 },
  { day: "18", count: 4 },
];

export type StatusKey =
  | "submitted"
  | "assigned"
  | "in-progress"
  | "completed"
  | "rejected";

export const STATUS: { key: StatusKey; label: string; count: number }[] = [
  { key: "submitted", label: "Submitted", count: 22 },
  { key: "assigned", label: "Assigned", count: 3 },
  { key: "in-progress", label: "In Progress", count: 2 },
  { key: "completed", label: "Completed", count: 4 },
  { key: "rejected", label: "Rejected", count: 1 },
];

/** Denominator for the status percentages: the whole book, not just the five states above. */
export const STATUS_TOTAL = 133;

export const ATTENTION: {
  name: string;
  ref: string;
  cc: string;
  country: string;
  state: string;
  /** A breach renders as the red badge; anything else as the quiet time pill. */
  age: string;
  breached?: boolean;
}[] = [
  {
    name: "Cenk Alex Tudosa",
    ref: "#355588d4",
    cc: "AE",
    country: "Antigua and Barbuda",
    state: "pending payment",
    age: "< 1h",
  },
  {
    name: "Shanta Akter",
    ref: "#f540e168",
    cc: "AE",
    country: "United Arab Emirates",
    state: "submitted",
    age: "3h ago",
  },
  {
    name: "Cenk Alex Tudosa",
    ref: "#7bba2599",
    cc: "AE",
    country: "United Arab Emirates",
    state: "assigned",
    age: "3h ago",
  },
  {
    name: "Cenk Alex Tudosa",
    ref: "#e79e6280",
    cc: "RU",
    country: "Russia",
    state: "pending payment",
    age: "SLA breach",
    breached: true,
  },
  {
    name: "Muhammad Qadeer",
    ref: "#b3ae8842",
    cc: "RU",
    country: "Russia",
    state: "pending payment",
    age: "SLA breach",
    breached: true,
  },
];

export const DESTINATIONS: { cc: string; name: string; count: number }[] = [
  { cc: "CN", name: "China", count: 40 },
  { cc: "AE", name: "United Arab Emirates", count: 13 },
  { cc: "IL", name: "Israel", count: 13 },
  { cc: "BF", name: "Burkina Faso", count: 10 },
  { cc: "US", name: "United States", count: 6 },
];

export const ACTIVITY: {
  time: string;
  staff: string;
  action: string;
  type: "Status update" | "Note";
}[] = [
  { time: "14:01", staff: "shammy", action: "Status changed from submitted to assigned", type: "Status update" },
  { time: "12:26", staff: "shammy", action: "Status changed from assigned to submitted", type: "Status update" },
  { time: "12:25", staff: "shammy", action: "Status changed from submitted to assigned", type: "Status update" },
  { time: "12:25", staff: "shammy", action: "Status changed from assigned to submitted", type: "Status update" },
  { time: "12:20", staff: "shammy", action: "Assigned to Atul rana", type: "Note" },
];

export const STAFF_ONLINE = 2;
export const UNREAD_NOTIFICATIONS = 29;
