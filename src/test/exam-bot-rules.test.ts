import { expect, it } from "vitest";
import { examEntryDecision, matchesStudentRegistration } from "@/lib/exam-bot-rules";
const entry = { full_name: "Student One", telegram_handle: "@student_one", section: "A", entered_at: "2026-11-14T00:00:00Z" };
it("requires the username registered beside the same student's name", () => {
  expect(matchesStudentRegistration("Student One", "@student_two", [{ full_name: "Student One", telegram_handle: "@student_one" }])).toBe(false);
});
it("matches registered usernames regardless of case and optional at sign", () => {
  expect(matchesStudentRegistration("Student One", "STUDENT_ONE", [entry])).toBe(true);
});
it("rejects a username already used by a different student", () => {
  expect(examEntryDecision(entry, "Student Two")).toBe("duplicate");
});
it("lets an already registered student return", () => {
  expect(examEntryDecision(entry, "Student One")).toBe("returning");
});