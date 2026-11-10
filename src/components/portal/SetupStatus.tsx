import { useEffect, useState } from "react";
import { getSetupStatus } from "@/lib/portal.functions";
import { CheckCircle2, XCircle } from "lucide-react";

type S = Awaited<ReturnType<typeof getSetupStatus>>;

export function SetupStatus() {
  const [s, setS] = useState<S | null>(null);
  useEffect(() => { getSetupStatus().then(setS).catch(() => {}); }, []);
  if (!s) return null;
  const items = [
    { label: "Database connected", ok: s.database && s.databaseWorks },
    { label: "Admin username & password", ok: s.admin_login },
    { label: "Admin session key", ok: s.session },
    { label: "Telegram bot connected", ok: s.bot && s.botWorks },
  ];
  if (items.every((i) => i.ok)) return null;
  return (
    <div className="rounded-xl border p-3 text-sm">
      <div className="mb-2 font-semibold">Setup checklist</div>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-2">
            {i.ok ? <CheckCircle2 size={16} className="text-success" /> : <XCircle size={16} className="text-destructive" />}
            <span className={i.ok ? "" : "text-muted-foreground"}>{i.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
