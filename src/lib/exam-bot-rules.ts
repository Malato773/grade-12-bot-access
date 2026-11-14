import { normalizeHandle, normalizeName } from "./school-constants";

export type ExamBotEntry = { telegram_handle: string; full_name: string; section: string; entered_at: string; chat_id?: number };
export function sameExamHandle(a: string, b: string) {
  return normalizeHandle(a).toLowerCase() === normalizeHandle(b).toLowerCase();
}
export function matchesStudentRegistration(name: string, handle: string, registrations: { full_name: string; telegram_handle: string }[]) {
  return registrations.some((r) => normalizeName(r.full_name) === normalizeName(name) && sameExamHandle(r.telegram_handle, handle));
}
export function examEntryDecision(existing: ExamBotEntry | null, name: string) {
  return !existing ? "new" : normalizeName(existing.full_name) === normalizeName(name) ? "returning" : "duplicate";
}