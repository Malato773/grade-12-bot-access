import { describe, expect, it } from "vitest";
import { PORTAL_BUTTONS } from "@/lib/portal-links";

describe("Telegram portal destinations", () => {
  it("opens verification on the official Lovable portal", () => {
    expect(PORTAL_BUTTONS.inline_keyboard[0]?.[0]?.web_app.url).toBe("https://bhsss-exam-bridge.lovable.app/");
  });
  it("opens Grade 12 directly on the exam bot page", () => {
    expect(PORTAL_BUTTONS.inline_keyboard[1]?.[0]?.web_app.url).toBe("https://bhsss-exam-bridge.lovable.app/?tab=exambot");
  });
});