import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { adminExamBotEntries } from "@/lib/portal.functions";

type Rows = Awaited<ReturnType<typeof adminExamBotEntries>>;

export function ExamBotEntriesPanel({ token }: { token: string }) {
  const get = useServerFn(adminExamBotEntries);
  const [rows, setRows] = useState<Rows | null>(null);
  const [q, setQ] = useState("");
  const load = useCallback(() => get({ data: { token } }).then(setRows).catch(() => toast.error("Could not load")), [get, token]);
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, [load]);
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
            <thead className="text-left text-muted-foreground"><tr><th className="p-2">Name</th><th className="p-2">Section</th><th className="p-2">Telegram</th><th className="p-2">Entered</th></tr></thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.telegram_handle} className="border-t">
                  <td className="p-2">{r.full_name}</td>
                  <td className="p-2">12{r.section}</td>
                  <td className="p-2">{r.telegram_handle}</td>
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
