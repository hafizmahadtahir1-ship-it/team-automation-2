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

export default function DashboardClient({ requests }: { requests: Request[] }) {
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
    if (status === "approved") return "bg-emerald-500/20 text-emerald-400";
    if (status === "rejected") return "bg-red-500/20 text-red-400";
    return "bg-amber-500/20 text-amber-400";
  };

  const exportCSV = () => {
    const csv = [
      ["ID", "Title", "Type", "Status", "Amount", "Created"],
      ...filtered.map((r) => [
        r.id,
        r.title,
        r.template_type,
        r.status,
        r.amount || "",
        new Date(r.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "approvals.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-mono">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-lg font-bold tracking-tight">
            Team<span className="text-emerald-400">Automation</span>
          </span>
        </div>
        <button
          onClick={exportCSV}
          className="border border-white/20 text-white hover:bg-white/10 text-xs px-4 py-2 rounded-lg transition-all"
        >
          Export CSV
        </button>
      </div>

      <div className="px-8 py-8 max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: counts.all, color: "text-white" },
            { label: "Pending", value: counts.pending, color: "text-amber-400" },
            { label: "Approved", value: counts.approved, color: "text-emerald-400" },
            { label: "Rejected", value: counts.rejected, color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-white/40 mt-1 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "approved", "rejected"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-xs capitalize transition-all ${
                tab === t
                  ? "bg-white text-black font-bold"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              {t} ({counts[t as keyof typeof counts]})
            </button>
          ))}
        </div>

        {/* Requests */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-sm">
              No requests found
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{r.title}</div>
                    <div className="text-xs text-white/40 mt-1">
                      {r.template_type} • {new Date(r.created_at).toLocaleDateString()}
                      {r.amount && ` • $${r.amount}`}
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