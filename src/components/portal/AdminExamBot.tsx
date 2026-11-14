import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { adminExamBotEntries, adminEditExamBotEntry, adminResetExamBotEntry } from "@/lib/portal.functions";
import { Pencil, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Rows = Awaited<ReturnType<typeof adminExamBotEntries>>;

export function ExamBotEntriesPanel({ token }: { token: string }) {
  const get = useServerFn(adminExamBotEntries);
  const edit = useServerFn(adminEditExamBotEntry);
  const reset = useServerFn(adminResetExamBotEntry);
  const [editing, setEditing] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<Rows | null>(null);
  const [q, setQ] = useState("");
  const load = useCallback(() => get({ data: { token } }).then(setRows).catch(() => toast.error("Could not load")), [get, token]);
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, [load]);
  async function save(oldHandle: string) {
    setBusy(true);
    try {
      const r = await edit({ data: { token, oldHandle, handle: username } });
      if (!r.ok) { toast.error(r.reason === "duplicate_username" ? "This username is already in the exam list." : "This username has not started the school bot."); return; }
      setEditing(null); await load(); toast.success("Username saved");
    } catch { toast.error("Could not save username. Check its format and try again."); } finally { setBusy(false); }
  }
  async function remove(handle: string) {
    if (!window.confirm("Reset this exam bot entry? Student registration and its history will stay saved.")) return;
    setBusy(true);
    try { await reset({ data: { token, handle } }); await load(); toast.success("Exam entry reset"); }
    catch { toast.error("Could not reset entry"); } finally { setBusy(false); }
  }
  if (!rows) return <p className="text-muted-foreground">Loading…</p>;
  const s = q.trim().toLowerCase();
  const shown = rows.filter((r) => !s || r.full_name.toLowerCase().includes(s) || r.telegram_handle.toLowerCase().includes(s));
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Grade 12 students who got the @BHSSS_EXAM_PORTAL_BOT link: <span className="font-semibold text-foreground">{rows.length}</span></p>
      <input className="field" aria-label="Search entries" placeholder="Search name or Telegram username…" value={q} onChange={(e) => setQ(e.target.value)} />
      {shown.length === 0 ? <p className="text-muted-foreground">No one yet.</p> : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground"><tr><th className="p-2">Name</th><th className="p-2">Section</th><th className="p-2">Telegram</th><th className="p-2">Student record</th><th className="p-2">Entered</th></tr></thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.telegram_handle} className="border-t">
                  <td className="p-2"><div className="flex items-center gap-2"><span>{r.full_name}</span><Button variant="ghost" size="icon" title="Edit username" aria-label={`Edit username for ${r.full_name}`} disabled={busy} onClick={() => { setEditing(r.telegram_handle); setUsername(r.telegram_handle); }}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" title="Reset exam entry" aria-label={`Reset exam entry for ${r.full_name}`} disabled={busy} onClick={() => remove(r.telegram_handle)}><RotateCcw className="size-4" /></Button></div></td>
                  <td className="p-2">12{r.section}</td>
                  <td className="p-2">{editing === r.telegram_handle ? <form className="flex items-center gap-1" onSubmit={(e) => { e.preventDefault(); void save(r.telegram_handle); }}><input className="field min-w-40" aria-label="Edit Telegram username" maxLength={33} value={username} onChange={(e) => setUsername(e.target.value)} autoFocus /><Button type="submit" variant="ghost" size="icon" aria-label="Save username" title="Save username" disabled={busy}><Check className="size-4" /></Button><Button type="button" variant="ghost" size="icon" aria-label="Cancel edit" title="Cancel edit" onClick={() => setEditing(null)}><X className="size-4" /></Button></form> : r.telegram_handle}</td>
                  <td className={`p-2 ${r.username_matches ? "text-success" : "text-destructive"}`}>{r.username_matches ? "Correct" : "Does not match"}</td>
                  <td className="p-2">{new Date(r.entered_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
