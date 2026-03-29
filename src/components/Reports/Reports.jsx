// src/components/Reports.jsx
import "./Reports.css";
import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import SectionTitle from "../SectionTitle";
import { useReports } from "../../hooks/useReports";

// Register only the Chart.js components we use — tree-shakeable
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// ── Colour palette ───────────────────────────────────────────
const STATUS_COLORS = {
  "New":           "#6b7280",
  "Contacted":     "#c49a28",
  "Qualified":     "#2563eb",
  "Proposal Sent": "#7c3aed",
  "Closed":        "#16a34a",
};

// ── Shared Chart.js option defaults ─────────────────────────
const TOOLTIP_DEFAULTS = {
  backgroundColor: "#ffffff",
  titleColor:      "#111111",
  bodyColor:       "#4b5563",
  borderColor:     "#e5e7eb",
  borderWidth:     1,
  padding:         10,
  cornerRadius:    6,
  titleFont:       { weight: "600", size: 12 },
  bodyFont:        { size: 12 },
};

// ── Sub-components ───────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <div className="report-stat">
      <div className="report-stat__label">{label}</div>
      <div className="report-stat__value">{value}</div>
      {sub && <div className="report-stat__sub">{sub}</div>}
    </div>
  );
}

function ChartCard({ title, sub, children, legend }) {
  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <span className="chart-card__title">{title}</span>
        {sub && <span className="chart-card__sub">{sub}</span>}
      </div>
      <div className="chart-card__body">{children}</div>
      {legend && (
        <div className="chart-legend">
          {legend.map((item) => (
            <span key={item.label} className="chart-legend__item">
              <span className="chart-legend__dot" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────
export default function Reports() {
  const {
    isLoading, error,
    pipelineData, byAgentData, statusData,
    totalLeads, leads,
  } = useReports();

  if (isLoading) {
    return (
      <div className="reports__loading">
        <div className="reports__spinner" />
        Loading report data…
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports__error">⚠ Failed to load reports: {error}</div>
    );
  }

  const closedCount   = leads.filter((l) => l.status === "Closed").length;
  const pipelineCount = totalLeads - closedCount;
  const agentCount    = new Set(leads.map((l) => l.salesAgent?.name).filter(Boolean)).size;

  // ── Chart 1 data: Pipeline vs Closed (Doughnut) ─────────────
  const pipelineChartData = {
    labels: ["In Pipeline", "Closed"],
    datasets: [{
      data:            [pipelineCount, closedCount],
      backgroundColor: ["#1a1d27", "#16a34a"],
      borderWidth:     0,
      hoverOffset:     4,
    }],
  };

  const doughnutOptions = {
    responsive:    true,
    maintainAspectRatio: true,
    cutout:        "65%",
    plugins: {
      legend:  { display: false },
      tooltip: { ...TOOLTIP_DEFAULTS },
    },
  };

  // ── Chart 2 data: Leads by agent (Bar) ──────────────────────
  const agentLabels = byAgentData.map((d) => d.agent);
  const agentChartData = {
    labels: agentLabels,
    datasets: [
      {
        label:           "Total Leads",
        data:            byAgentData.map((d) => d.total),
        backgroundColor: "#1a1d27",
        borderRadius:    4,
        borderSkipped:   false,
      },
      {
        label:           "Closed",
        data:            byAgentData.map((d) => d.closed),
        backgroundColor: "#16a34a",
        borderRadius:    4,
        borderSkipped:   false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth:   10,
          boxHeight:  10,
          borderRadius: 5,
          useBorderRadius: true,
          font:       { size: 11 },
          color:      "#6b7280",
          padding:    16,
        },
      },
      tooltip: { ...TOOLTIP_DEFAULTS },
    },
    scales: {
      x: {
        grid:      { display: false },
        ticks:     { font: { size: 11 }, color: "#9ca3af" },
        border:    { display: false },
      },
      y: {
        grid:      { color: "#f3f4f6" },
        ticks:     { font: { size: 11 }, color: "#9ca3af", precision: 0 },
        border:    { display: false, dash: [4, 4] },
        beginAtZero: true,
      },
    },
  };

  // ── Chart 3 data: Status distribution (Doughnut) ────────────
  const statusLabels = statusData.map((s) => s.status);
  const statusChartData = {
    labels: statusLabels,
    datasets: [{
      data:            statusData.map((s) => s.count),
      backgroundColor: statusLabels.map((s) => STATUS_COLORS[s] ?? "#9ca3af"),
      borderWidth:     0,
      hoverOffset:     4,
    }],
  };

  return (
    <div className="reports">
      <SectionTitle>Reports</SectionTitle>

      {/* Summary stats */}
      <div className="reports__stats">
        <StatCard label="Total Leads"   value={totalLeads}    sub="all time" />
        <StatCard label="In Pipeline"   value={pipelineCount} sub="active leads" />
        <StatCard label="Closed"        value={closedCount}   sub="completed" />
        <StatCard label="Active Agents" value={agentCount}    sub="assigned to leads" />
      </div>

      {/* Charts row — two doughnuts side by side */}
      <div className="reports__charts">

        {/* Chart 1 — Pipeline vs Closed */}
        <ChartCard
          title="Pipeline vs Closed"
          sub={`${totalLeads} total leads`}
          legend={[
            { label: `In Pipeline (${pipelineCount})`, color: "#1a1d27" },
            { label: `Closed (${closedCount})`,        color: "#16a34a" },
          ]}
        >
          <Doughnut data={pipelineChartData} options={doughnutOptions} />
        </ChartCard>

        {/* Chart 3 — Status distribution */}
        <ChartCard
          title="Lead Status Distribution"
          sub={`across ${totalLeads} leads`}
          legend={statusData.map((s) => ({
            label: `${s.status} (${s.count})`,
            color: STATUS_COLORS[s.status] ?? "#9ca3af",
          }))}
        >
          <Doughnut data={statusChartData} options={doughnutOptions} />
        </ChartCard>

      </div>

      {/* Chart 2 — Leads by agent, full width bar chart */}
      <ChartCard
        title="Leads by Sales Agent"
        sub="total assigned vs closed"
      >
        <div style={{ height: 260 }}>
          <Bar data={agentChartData} options={barOptions} />
        </div>
      </ChartCard>

    </div>
  );
}