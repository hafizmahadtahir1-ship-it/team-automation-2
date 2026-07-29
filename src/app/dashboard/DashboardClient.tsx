"use client";

import { useState } from "react";

type Request = {
  id: string;
  title: string;
  status: string;
  template_type: string;
  slack_channel_id: string;
  created_at: string;
  amount?: number;
};

export default function DashboardClient({ requests, userId, slackConnected }: { requests: Request[]; userId: string; slackConnected?: boolean }) {
console.log("slackConnected:", slackConnected);
  const [tab, setTab] = useState("all");

  const filtered = requests.filter((r) =>
    tab === "all" ? true : r.status === tab
  );

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const statusStyle = (status: string) => {
    if (status === "approved") return "bg-[#d4a843]/20 text-[#d4a843] border border-[#d4a843]/30";
    if (status === "rejected") return "bg-red-500/20 text-red-400 border border-red-500/30";
    return "bg-white/10 text-white/70 border border-white/20";
  };

 const exportCSV = () => {
    // Properly escape CSV fields: wrap in quotes, double internal quotes
    const escapeCSV = (value: string | number | undefined) => {
      const str = String(value ?? "");
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = [
      ["Request ID", "Title", "Type", "Status", "Amount", "Created"],
      ...filtered.map((r) => [
        r.id,
        r.title,
        r.template_type,
        r.status,
        r.amount ?? "",
        new Date(r.created_at).toLocaleDateString(),
      ]),
    ];

    const csv = rows.map((row) => row.map(escapeCSV).join(",")).join("\n");

    // BOM + UTF-8 charset = Excel opens correctly
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "approvals.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url); // Prevent memory leak
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-4 flex items-center justify-between bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <span className="text-[#d4a843] text-xl">⚡</span>
          <span className="text-lg font-bold tracking-tight">
            Team<span className="text-[#d4a843]">Automation</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {slackConnected ? (
  <span className="flex items-center gap-2 bg-[#007a5a]/30 text-[#007a5a] text-xs font-semibold px-4 py-2 rounded-lg border border-[#007a5a]/30">
    ✅ Slack Connected
  </span>
) : (
  <a
    href={`https://slack.com/oauth/v2/authorize?client_id=9731924865781.10770998800916&scope=chat:write,commands,users:read&user_scope=&state=${userId}`}
    className="flex items-center gap-2 bg-[#007a5a] hover:bg-[#005c44] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
  >
    🔌 Connect Slack
  </a>
)}
          <button
            onClick={exportCSV}
            className="border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-xs px-4 py-2 rounded-lg transition-all"
          >
            Export CSV
          </button>
          <button
            onClick={async () => {
              const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ team_id: "test", slack_workspace_id: "test" }),
              });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }}
            className="bg-[#d4a843] hover:bg-[#c49535] text-black font-bold text-xs px-4 py-2 rounded-lg transition-all"
          >
            Upgrade to Pro →
          </button>
          <button
            onClick={async () => {
              const { createClient } = await import("@/lib/supabase-client");
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="border border-white/20 text-white/70 hover:text-red-400 hover:border-red-400/40 text-xs px-4 py-2 rounded-lg transition-all"
          >
            Logout
        
          </button>
        </div>
      </div>

      <div className="px-8 py-8 max-w-6xl mx-auto">
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: counts.all, color: "text-white" },
            { label: "Pending", value: counts.pending, color: "text-white/60" },
            { label: "Approved", value: counts.approved, color: "text-[#d4a843]" },
            { label: "Rejected", value: counts.rejected, color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#d4a843]/30 transition-all">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-white/40 mt-1 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "approved", "rejected"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-xs capitalize font-semibold transition-all ${
                tab === t
                  ? "bg-[#d4a843] text-black"
                  : "bg-white/5 text-white/50 hover:bg-white/10 border border-white/10"
              }`}
            >
              {t} ({counts[t as keyof typeof counts]})
            </button>
          ))}
        </div>

        {/* Requests */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-white/40 text-sm">No requests yet</div>
              <div className="text-white/20 text-xs mt-1">Connect Slack to start receiving approvals</div>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#d4a843]/30 transition-all"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{r.title}</div>
                    <div className="text-xs text-white/40 mt-1">
                      {r.template_type} · {new Date(r.created_at).toLocaleDateString()}
                      {r.amount && ` · $${r.amount}`}
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusStyle(r.status)}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}