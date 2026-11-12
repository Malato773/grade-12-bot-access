import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const config = JSON.parse(readFileSync("vercel.json", "utf8"));

describe("Vercel portal deployment", () => {
  it("keeps pages, assets, and server functions on the same published portal", () => {
    expect(config.rewrites).toEqual([
      { source: "/:path*", destination: "https://bhsss-exam-bridge.lovable.app/:path*" },
    ]);
  });

  it("does not build a second server that needs unavailable managed credentials", () => {
    expect(config.framework).toBeNull();
    expect(config.buildCommand).toBe("mkdir -p vercel-output");
    expect(config.outputDirectory).toBe("vercel-output");
  });
});