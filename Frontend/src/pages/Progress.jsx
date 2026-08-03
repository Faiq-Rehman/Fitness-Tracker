import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Dumbbell,
  Pencil,
  Plus,
  RefreshCw,
  Ruler,
  Scale,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiFetch } from "../utils/auth.js";
import PageHeader from "../components/PageHeader.jsx";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return todayStr();
  const str = String(value);
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return isoMatch[0];
  }
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return str.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function normalizeProgressItem(i) {
  const rawDate = i.date || i.progressDate || i.createdAt;
  const dateStr = formatDate(rawDate);

  const liftVal = Number(i.lift ?? i.liftingWeight ?? i.bestLift ?? 0);
  const weightVal = Number(i.weight ?? 0);
  const waistVal = Number(i.waist ?? i.chest ?? 0);
  const runTimeVal = Number(i.runTime ?? 0);

  return {
    ...i,
    id: i._id || i.id,
    date: dateStr,
    progressDate: dateStr,
    weight: weightVal,
    waist: waistVal,
    runTime: runTimeVal,
    lift: liftVal,
    liftingWeight: liftVal,
    notes: i.notes || "",
  };
}

const EMPTY_FORM = {
  date: todayStr(),
  weight: "",
  waist: "",
  runTime: "",
  lift: "",
  notes: "",
};

export default function Progress() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [saving, setSaving] = useState(false);

  const loadProgress = async () => {
    try {
      const res = await apiFetch("/progress");
      const rawList = res.data || res.progress || (Array.isArray(res) ? res : []);
      const normalized = rawList.map(normalizeProgressItem);
      setItems(normalized);
    } catch (err) {
      console.error("Error loading progress:", err);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [items]);

  const latest = sortedItems.at(-1) || {};
  const first = sortedItems[0] || {};
  const weightChange = (
    Number(latest.weight || 0) - Number(first.weight || 0)
  ).toFixed(1);

  const bestLift = useMemo(() => {
    if (!items.length) return 0;
    return Math.max(0, ...items.map((i) => Number(i.lift) || 0));
  }, [items]);

  const bestRun = useMemo(() => {
    const validRuns = items
      .map((i) => Number(i.runTime))
      .filter((val) => val > 0);
    return validRuns.length ? Math.min(...validRuns) : 0;
  }, [items]);

  const chartData = useMemo(() => {
    return sortedItems.map((i) => {
      const d = new Date(i.date);
      const label = Number.isNaN(d.getTime())
        ? i.date
        : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      return {
        dateLabel: label,
        weight: Number(i.weight) || 0,
        waist: Number(i.waist) || 0,
        lift: Number(i.lift) || 0,
      };
    });
  }, [sortedItems]);

  function notify(msg, type = "success") {
    setMessage(msg);
    setMessageType(type);
    window.setTimeout(() => setMessage(""), 3500);
  }

  function openNewForm() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, date: todayStr() });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleEdit(item) {
    setEditingId(item.id || item._id);
    setForm({
      date: formatDate(item.date || item.progressDate),
      weight: String(item.weight ?? ""),
      waist: String(item.waist ?? ""),
      runTime: String(item.runTime ?? ""),
      lift: String(item.lift ?? item.liftingWeight ?? ""),
      notes: item.notes ?? "",
    });
    setShowForm(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.date || Number(form.weight) <= 0) {
      notify("Valid date aur weight (kg) enter karo.", "error");
      return;
    }

    const weightVal = Number(form.weight);
    const waistVal = Number(form.waist) || 0;
    const runTimeVal = Number(form.runTime) || 0;
    const liftVal = Number(form.lift) || 0;
    const dateVal = formatDate(form.date);

    const payload = {
      date: dateVal,
      progressDate: dateVal,
      weight: weightVal,
      waist: waistVal,
      runTime: runTimeVal,
      lift: liftVal,
      liftingWeight: liftVal,
      notes: (form.notes || "").trim(),
    };

    try {
      setSaving(true);
      if (editingId !== null) {
        const updated = await apiFetch(`/progress/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        const updatedEntry = normalizeProgressItem({
          ...payload,
          ...(updated?.data || updated?.progress || updated || {}),
        });

        setItems((prev) =>
          prev.map((i) => (i.id === editingId || i._id === editingId ? updatedEntry : i))
        );
        notify("Progress entry update ho gayi!");
      } else {
        const created = await apiFetch("/progress", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const newEntry = normalizeProgressItem({
          ...payload,
          ...(created?.data || created?.progress || created || {}),
        });

        setItems((prev) => [...prev, newEntry]);
        notify("New progress entry add ho gayi!");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      notify(err.message || "Error saving progress entry", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Kya tum ye progress entry delete karna chahte ho?")) {
      try {
        await apiFetch(`/progress/${id}`, { method: "DELETE" });
        setItems((prev) => prev.filter((i) => i.id !== id && i._id !== id));
        notify("Progress entry delete ho gayi.");
      } catch (err) {
        notify(err.message || "Error deleting entry", "error");
      }
    }
  }

  return (
    <div className="reports-container">
      <PageHeader
        eyebrow="Analytics & Records"
        title="Fitness Progress"
        description="Monitor your weight trends, waist measurements, running performance, and personal lifting records."
        action={
          <button type="button" className="primary-btn" onClick={openNewForm}>
            <Plus size={18} /> Add Progress Entry
          </button>
        }
      />

      {message && (
        <div className={`reports-toast ${messageType === "error" ? "error" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {messageType === "error" ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{message}</span>
          </div>
          <button type="button" className="clear-search-btn" onClick={() => setMessage("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats Cards Banner */}
      <section className="reports-stats-grid">
        <div className="report-stat-card type-workout">
          <div className="report-stat-icon workout">
            {Number(weightChange) <= 0 ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
          </div>
          <div className="report-stat-info">
            <span>Weight Change</span>
            <strong>
              {Number(weightChange) > 0 ? `+${weightChange}` : weightChange} kg
            </strong>
            <small>Total net shift</small>
          </div>
        </div>

        <div className="report-stat-card type-nutrition">
          <div className="report-stat-icon nutrition">
            <Ruler size={24} />
          </div>
          <div className="report-stat-info">
            <span>Current Waist</span>
            <strong>{latest.waist ? `${latest.waist} cm` : "-"}</strong>
            <small>Latest waist measurement</small>
          </div>
        </div>

        <div className="report-stat-card type-progress">
          <div className="report-stat-icon progress">
            <Trophy size={24} />
          </div>
          <div className="report-stat-info">
            <span>Best Lift Record</span>
            <strong>{bestLift ? `${bestLift} kg` : "-"}</strong>
            <small>Personal best weight</small>
          </div>
        </div>

        <div className="report-stat-card type-complete">
          <div className="report-stat-icon complete">
            <Zap size={24} />
          </div>
          <div className="report-stat-info">
            <span>Best 5km Run</span>
            <strong>{bestRun ? `${bestRun} min` : "-"}</strong>
            <small>Top speed time</small>
          </div>
        </div>
      </section>

      {/* Progress Form Modal */}
      {showForm && (
        <div className="reports-modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeForm()}>
          <div className="reports-modal-box">
            <div className="reports-modal-header">
              <div>
                <p className="eyebrow">{editingId !== null ? "Edit Entry" : "New Record"}</p>
                <h2>{editingId !== null ? "Progress Details Update Karo" : "Log Fitness Metrics"}</h2>
              </div>
              <button type="button" className="clear-search-btn" onClick={closeForm} aria-label="Close form">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
              <div className="form-grid">
                <label>
                  Date
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Body Weight (kg)
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="e.g. 72.5"
                    required
                  />
                </label>

                <label>
                  Waist Size (cm)
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    name="waist"
                    value={form.waist}
                    onChange={handleChange}
                    placeholder="e.g. 82"
                  />
                </label>

                <label>
                  5 km Run Time (min)
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    name="runTime"
                    value={form.runTime}
                    onChange={handleChange}
                    placeholder="e.g. 24.5"
                  />
                </label>

                <label style={{ gridColumn: "1 / -1" }}>
                  Best Lifting Weight / PR (kg)
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    name="lift"
                    value={form.lift}
                    onChange={handleChange}
                    placeholder="e.g. 95"
                  />
                </label>
              </div>

              <label style={{ display: "grid", gap: 8, fontWeight: 700, color: "var(--text)" }}>
                Notes / Experience
                <textarea
                  rows={3}
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Record your feelings, energy level or PR milestone..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text)",
                  }}
                />
              </label>

              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw size={18} className="spin" /> Saving...
                    </>
                  ) : editingId !== null ? (
                    "Update Entry"
                  ) : (
                    "Save Progress Entry"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Weight Trend Recharts Area Chart */}
      {chartData.length > 0 && (
        <section className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <span className="eyebrow">Analytics Chart</span>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Weight Trend History</h3>
            </div>
            <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
              {chartData.length} entries tracked
            </span>
          </div>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="dateLabel" stroke="var(--muted)" fontSize={12} tickLine={false} />
                <YAxis
                  domain={["dataMin - 2", "dataMax + 2"]}
                  stroke="var(--muted)"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    color: "var(--text)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#weightGrad)"
                  dot={{ r: 4, fill: "var(--primary)", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Progress Cards List */}
      {sortedItems.length === 0 ? (
        <div className="reports-empty-state">
          <div className="reports-empty-icon">
            <Scale size={32} />
          </div>
          <h3>No progress entries yet</h3>
          <p>
            Apni body weight, waist measurement aur lifting PRs record karne ke liye button par click karo.
          </p>
          <button type="button" className="primary-btn" onClick={openNewForm}>
            <Sparkles size={18} /> Add Progress Entry
          </button>
        </div>
      ) : (
        <div className="reports-list-grid">
          {[...sortedItems].reverse().map((item) => {
            const id = item.id || item._id;

            return (
              <article className="report-card-item" key={id}>
                <div className="report-item-icon Progress">
                  <Dumbbell size={24} />
                </div>

                <div className="report-item-main">
                  <div className="report-item-tags">
                    <span className="type-tag Progress">Progress Log</span>
                    <span className="ext-tag">
                      <Calendar size={11} style={{ verticalAlign: "middle", marginRight: 3 }} />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="report-item-title">{item.weight} kg Body Weight</h3>

                  <div className="report-item-meta" style={{ marginTop: 8 }}>
                    {item.lift > 0 && (
                      <span
                        className="macro-chip macro-chip-cal"
                        style={{ background: "rgba(108, 92, 231, 0.12)", color: "#6c5ce7", border: "1px solid rgba(108, 92, 231, 0.2)" }}
                      >
                        <Trophy size={13} /> Lift: {item.lift} kg
                      </span>
                    )}

                    {item.waist > 0 && (
                      <span className="macro-chip macro-chip-protein">
                        <Ruler size={13} /> Waist: {item.waist} cm
                      </span>
                    )}

                    {item.runTime > 0 && (
                      <span className="macro-chip macro-chip-carbs">
                        <Activity size={13} /> Run: {item.runTime} min
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>
                      "{item.notes}"
                    </p>
                  )}
                </div>

                <div className="report-item-actions">
                  <button
                    type="button"
                    className="report-action-btn"
                    onClick={() => handleEdit(item)}
                    title="Edit entry"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    type="button"
                    className="report-action-btn danger-btn"
                    onClick={() => handleDelete(id)}
                    title="Delete entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
