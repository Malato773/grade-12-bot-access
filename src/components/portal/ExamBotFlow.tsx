import { useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { HANDLE_RE } from "@/lib/school-constants";
import { checkGrade12Name, enterExamPortalBot } from "@/lib/portal.functions";

export function ExamBotFlow({ supportUrl }: { supportUrl: string }) {
  const checkName = useServerFn(checkGrade12Name);
  const enter = useServerFn(enterExamPortalBot);
  const [step, setStep] = useState<"name" | "handle" | "done">("name");
  const [name, setName] = useState("");
  const [student, setStudent] = useState<{ name: string; section: string } | null>(null);
  const [handle, setHandle] = useState("");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const help = { action: { label: "Contact us", onClick: () => window.open(supportUrl, "_blank") } };

  async function submitName(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 3) { toast.error("Enter your full name"); return; }
    setBusy(true);
    try {
      const r = await checkName({ data: { name } });
      if (r.ok) { setStudent({ name: r.name, section: r.section }); setStep("handle"); }
      else toast.error("This page is only for Grade 12 students. Type your full name exactly as on the school list.", help);
    } catch { toast.error("Please try again."); } finally { setBusy(false); }
  }

  async function submitHandle(e: React.FormEvent) {
    e.preventDefault();
    if (!HANDLE_RE.test(handle.trim())) { toast.error("Enter a valid Telegram username"); return; }
    setBusy(true);
    try {
      const r = await enter({ data: { name: student?.name ?? name, handle } });
      if (r.ok) { setLink(r.link); setStep("done"); }
      else if (r.reason === "not_in_bot") toast.error("This username hasn't started our school bot yet. Open the school bot, press Start, then try again.", help);
      else toast.error("This page is only for Grade 12 students.", help);
    } catch { toast.error("Please try again."); } finally { setBusy(false); }
  }

  return (
    <div className="glass space-y-4 rounded-2xl p-5 sm:p-7">
      <h2 className="text-xl font-bold">Grade 12 exam portal</h2>
      {step === "name" && (
        <form onSubmit={submitName} className="space-y-3">
          <p className="text-sm text-muted-foreground">Step 1 of 2 — enter your full name.</p>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} placeholder="Full name" autoFocus />
          <button className="btn-glow w-full" disabled={busy}>{busy ? "Checking…" : "Continue"}</button>
        </form>
      )}
      {step === "handle" && student && (
        <form onSubmit={submitHandle} className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Hi <span className="font-semibold text-foreground">{student.name}</span> (12{student.section}). Step 2 of 2 — enter the Telegram username you registered with our bot.
          </p>
          <input className="field" value={handle} onChange={(e) => setHandle(e.target.value)} maxLength={33} placeholder="@telegram username" autoFocus />
          <button className="btn-glow w-full" disabled={busy}>{busy ? "Checking…" : "Get the bot link"}</button>
          <button type="button" className="btn-ghost w-full text-sm" onClick={() => setStep("name")}>Back</button>
        </form>
      )}
      {step === "done" && (
        <div className="space-y-3 text-center">
          <p className="font-semibold text-success">You're verified, {student?.name}!</p>
          <a href={link} target="_blank" rel="noreferrer" className="btn-glow inline-flex w-full justify-center">Open @BHSSS_EXAM_PORTAL_BOT</a>
        </div>
      )}
    </div>
  );
}
