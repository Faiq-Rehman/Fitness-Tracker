import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Dumbbell,
  FileBarChart,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  Utensils,
  X,
  Download,
  AlertCircle
} from "lucide-react";
import { apiFetch } from "../utils/auth.js";
import PageHeader from "../components/PageHeader.jsx";

const REPORT_TYPES = ["Workout", "Nutrition", "Progress", "Complete"];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeReportType(type) {
  if (!type) return "Workout";
  const t = String(type).trim().toLowerCase();
  if (t === "workout") return "Workout";
  if (t === "nutrition") return "Nutrition";
  if (t === "progress") return "Progress";
  if (t === "complete") return "Complete";
  return "Workout";
}

const EMPTY_FORM = {
  reportType: "Workout",
  fileName: `Workout-Report-${todayStr()}`,
  generatedDate: todayStr(),
};

function reportIcon(type) {
  const norm = normalizeReportType(type);
  if (norm === "Workout") return <Dumbbell size={22} />;
  if (norm === "Nutrition") return <Utensils size={22} />;
  if (norm === "Progress") return <TrendingUp size={22} />;
  return <FileBarChart size={22} />;
}

function formatDate(value) {
  if (!value) return todayStr();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function toCSV(rows) {
  if (!rows || !rows.length) return "No data available for this period.";
  const headers = Object.keys(rows[0]);
  const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  });
  return lines.join("\n");
}

function downloadFile(fileName, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function buildReportContent(reportType) {
  const normType = normalizeReportType(reportType);

  if (normType === "Workout") {
    const res = await apiFetch("/workouts");
    const workouts = res.workouts || res.data || [];
    const rows = workouts.map((w) => ({
      Exercise: w.exerciseName,
      Category: w.category,
      Sets: w.sets,
      Reps: w.reps,
      "Weight (kg)": w.weight,
      Date: formatDate(w.workoutDate),
    }));
    return toCSV(rows);
  }

  if (normType === "Nutrition") {
    const res = await apiFetch("/nutrition");
    const meals = res.nutrition || res.data || [];
    const rows = meals.map((m) => ({
      Meal: m.mealType,
      Food: m.foodName,
      Quantity: m.quantity,
      Calories: m.calories,
      "Protein (g)": m.protein,
      "Carbs (g)": m.carbs,
      "Fats (g)": m.fats,
      Date: formatDate(m.mealDate),
    }));
    return toCSV(rows);
  }

  if (normType === "Progress") {
    const res = await apiFetch("/progress");
    const entries = res.progress || res.data || [];
    const rows = entries.map((p) => ({
      "Weight (kg)": p.weight,
      "Chest (in)": p.chest,
      "Waist (in)": p.waist,
      "Biceps (in)": p.biceps,
      "Run Time": p.runTime,
      "Lifting Weight (kg)": p.liftingWeight,
      Date: formatDate(p.progressDate),
    }));
    return toCSV(rows);
  }

  // Complete Audit
  const [workoutRes, nutritionRes, progressRes] = await Promise.all([
    apiFetch("/workouts"),
    apiFetch("/nutrition"),
    apiFetch("/progress"),
  ]);
  const workouts = workoutRes.workouts || workoutRes.data || [];
  const meals = nutritionRes.nutrition || nutritionRes.data || [];
  const progressEntries = progressRes.progress || progressRes.data || [];

  const totalCalories = meals.reduce((sum, m) => sum + Number(m.calories || 0), 0);
  const totalSets = workouts.reduce((sum, w) => sum + Number(w.sets || 0), 0);
  const latestWeight = progressEntries.length ? progressEntries[0].weight : "-";

  const rows = [
    { Metric: "Total Workouts Logged", Value: workouts.length },
    { Metric: "Total Sets Logged", Value: totalSets },
    { Metric: "Total Meals Logged", Value: meals.length },
    { Metric: "Total Calories (all meals)", Value: totalCalories },
    { Metric: "Progress Entries Logged", Value: progressEntries.length },
    { Metric: "Most Recent Weight (kg)", Value: latestWeight },
  ];
  return toCSV(rows);
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [generating, setGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/reports");
        const rawReports = res.reports || res.data || [];
        const normalized = rawReports.map((r) => ({
          ...r,
          reportType: normalizeReportType(r.reportType),
          generatedDate: formatDate(r.generatedDate || r.createdAt),
        }));
        setReports(normalized);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const filteredReports = useMemo(() => {
    const search = query.trim().toLowerCase();
    return reports.filter((report) => {
      const type = normalizeReportType(report.reportType);
      const matchesSearch = !search || (report.fileName || "").toLowerCase().includes(search);
      const matchesFilter = typeFilter === "All" || type === typeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [reports, query, typeFilter]);

  const counts = useMemo(() => {
    const base = { Workout: 0, Nutrition: 0, Progress: 0, Complete: 0 };
    reports.forEach((r) => {
      const type = normalizeReportType(r.reportType);
      if (base[type] !== undefined) base[type] += 1;
    });
    return base;
  }, [reports]);

  function notify(msg, type = "success") {
    setMessage(msg);
    setMessageType(type);
    window.setTimeout(() => setMessage(""), 3500);
  }

  function openNewReportForm() {
    setForm({ ...EMPTY_FORM, fileName: `Workout-Report-${todayStr()}`, generatedDate: todayStr() });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setForm(EMPTY_FORM);
  }

  function applyPresetTemplate(type, label) {
    const norm = normalizeReportType(type);
    const name = `${label.replace(/\s+/g, "-")}-${todayStr()}`;
    setForm({
      reportType: norm,
      fileName: name,
      generatedDate: todayStr(),
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "reportType") {
        const oldType = current.reportType;
        const newType = normalizeReportType(value);
        next.reportType = newType;
        if (current.fileName.startsWith(`${oldType}-Report-`)) {
          next.fileName = current.fileName.replace(`${oldType}-Report-`, `${newType}-Report-`);
        } else {
          next.fileName = `${newType}-Report-${current.generatedDate || todayStr()}`;
        }
      }
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.fileName.trim()) {
      notify("File name required hai.", "error");
      return;
    }

    const normType = normalizeReportType(form.reportType);
    const normDate = formatDate(form.generatedDate);

    const reportData = {
      reportType: normType,
      fileName: form.fileName.trim(),
      generatedDate: normDate,
      fileUrl: "",
    };

    try {
      setGenerating(true);
      const csvContent = await buildReportContent(normType);

      const created = await apiFetch("/reports", {
        method: "POST",
        body: JSON.stringify(reportData),
      });
      const newReportRaw = created.report || created.data || created;
      const newReport = {
        ...newReportRaw,
        reportType: normType,
        fileName: form.fileName.trim(),
        generatedDate: normDate,
      };
      setReports((current) => [newReport, ...current]);

      downloadFile(form.fileName.trim(), csvContent);
      notify("Report generate aur download ho gaya!");

      setShowForm(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      notify(err.message || "Error generating report", "error");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Kya tum ye report delete karna chahte ho?")) {
      try {
        await apiFetch(`/reports/${id}`, { method: "DELETE" });
        setReports((current) => current.filter((report) => (report._id || report.id) !== id));
        notify("Report delete ho gaya.");
      } catch (err) {
        notify(err.message || "Error deleting report", "error");
      }
    }
  }

  async function handleDownload(report) {
    const id = report._id || report.id;
    setDownloadingId(id);
    try {
      const type = normalizeReportType(report.reportType);
      const csvContent = await buildReportContent(type);
      downloadFile(report.fileName, csvContent);
      notify(`${report.fileName}.csv downloaded!`);
    } catch (err) {
      notify(err.message || "Error downloading report", "error");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="reports-container">
      <PageHeader
        eyebrow="Analytics & Export"
        title="Reports"
        description="Generate and download CSV reports for your workouts, nutrition and overall progress."
        action={
          <button type="button" className="primary-btn" onClick={openNewReportForm}>
            <Plus size={18} /> Generate Report
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

      {/* Interactive Stat Cards Banner */}
      <section className="reports-stats-grid">
        <div
          className={`report-stat-card type-workout ${typeFilter === "Workout" ? "active" : ""}`}
          onClick={() => setTypeFilter((prev) => (prev === "Workout" ? "All" : "Workout"))}
          role="button"
          tabIndex={0}
        >
          <div className="report-stat-icon workout">
            <Dumbbell size={24} />
          </div>
          <div className="report-stat-info">
            <span>Workout Reports</span>
            <strong>{counts.Workout}</strong>
            <small>Exercise & set data</small>
          </div>
        </div>

        <div
          className={`report-stat-card type-nutrition ${typeFilter === "Nutrition" ? "active" : ""}`}
          onClick={() => setTypeFilter((prev) => (prev === "Nutrition" ? "All" : "Nutrition"))}
          role="button"
          tabIndex={0}
        >
          <div className="report-stat-icon nutrition">
            <Utensils size={24} />
          </div>
          <div className="report-stat-info">
            <span>Nutrition Reports</span>
            <strong>{counts.Nutrition}</strong>
            <small>Meal & calorie logs</small>
          </div>
        </div>

        <div
          className={`report-stat-card type-progress ${typeFilter === "Progress" ? "active" : ""}`}
          onClick={() => setTypeFilter((prev) => (prev === "Progress" ? "All" : "Progress"))}
          role="button"
          tabIndex={0}
        >
          <div className="report-stat-icon progress">
            <TrendingUp size={24} />
          </div>
          <div className="report-stat-info">
            <span>Progress Reports</span>
            <strong>{counts.Progress}</strong>
            <small>Body & weight metrics</small>
          </div>
        </div>

        <div
          className={`report-stat-card type-complete ${typeFilter === "Complete" ? "active" : ""}`}
          onClick={() => setTypeFilter((prev) => (prev === "Complete" ? "All" : "Complete"))}
          role="button"
          tabIndex={0}
        >
          <div className="report-stat-icon complete">
            <FileBarChart size={24} />
          </div>
          <div className="report-stat-info">
            <span>Complete Audit</span>
            <strong>{counts.Complete}</strong>
            <small>Full system overview</small>
          </div>
        </div>
      </section>

      {/* Toolbar & Filter Chips */}
      <section className="reports-toolbar">
        <div className="reports-toolbar-top">
          <div className="reports-search-box">
            <Search size={18} style={{ color: "var(--muted)" }} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by report or file name..."
            />
            {query && (
              <button type="button" className="clear-search-btn" onClick={() => setQuery("")}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="reports-filter-chips">
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginRight: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Filter size={14} /> Filter:
            </span>
            <button
              type="button"
              className={`chip-btn ${typeFilter === "All" ? "active" : ""}`}
              onClick={() => setTypeFilter("All")}
            >
              All <span className="chip-count">{reports.length}</span>
            </button>
            {REPORT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`chip-btn ${typeFilter === type ? "active" : ""}`}
                onClick={() => setTypeFilter(type)}
              >
                {type} <span className="chip-count">{counts[type] || 0}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reports Card List */}
      {filteredReports.length === 0 ? (
        <div className="reports-empty-state">
          <div className="reports-empty-icon">
            <FileText size={32} />
          </div>
          <h3>No reports found</h3>
          <p>
            {query || typeFilter !== "All"
              ? "Aapke search ya filter matching koi report nahi mili. Filter clear karke try karo."
              : "Apni pehli fitness ya nutrition report generate karne ke liye uper diye gaye button par click karo."}
          </p>
          <button type="button" className="primary-btn" onClick={openNewReportForm}>
            <Sparkles size={18} /> Generate New Report
          </button>
        </div>
      ) : (
        <div className="reports-list-grid">
          {filteredReports.map((report) => {
            const id = report._id || report.id;
            const isDownloading = downloadingId === id;
            const type = normalizeReportType(report.reportType);
            const displayDate = formatDate(report.generatedDate || report.createdAt);

            return (
              <article className="report-card-item" key={id}>
                <div className={`report-item-icon ${type}`}>
                  {reportIcon(type)}
                </div>

                <div className="report-item-main">
                  <div className="report-item-tags">
                    <span className={`type-tag ${type}`}>{type}</span>
                    <span className="ext-tag">CSV</span>
                  </div>
                  <h3 className="report-item-title" title={report.fileName}>
                    {report.fileName}
                  </h3>
                  <div className="report-item-meta">
                    <span className="report-item-meta-item">
                      <Calendar size={14} /> Generated: {displayDate}
                    </span>
                    <span className="report-item-meta-item">
                      <FileText size={14} /> Ready for export
                    </span>
                  </div>
                </div>

                <div className="report-item-actions">
                  <button
                    type="button"
                    className="report-action-btn download-btn"
                    onClick={() => handleDownload(report)}
                    disabled={isDownloading}
                    title="Download CSV file"
                  >
                    {isDownloading ? <RefreshCw size={18} className="spin" /> : <Download size={18} />}
                  </button>

                  <button
                    type="button"
                    className="report-action-btn danger-btn"
                    onClick={() => handleDelete(id)}
                    title="Delete report"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* New Report Modal */}
      {showForm && (
        <div className="reports-modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeForm()}>
          <div className="reports-modal-box">
            <div className="reports-modal-header">
              <div>
                <p className="eyebrow">Generate Report</p>
                <h2>New CSV Report Config</h2>
              </div>
              <button type="button" className="clear-search-btn" onClick={closeForm} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", display: "block", marginBottom: 8 }}>
                Quick Preset Templates:
              </span>
              <div className="preset-templates">
                <button type="button" className="preset-btn" onClick={() => applyPresetTemplate("Workout", "Workout Log")}>
                  🏋️ Workout Log
                </button>
                <button type="button" className="preset-btn" onClick={() => applyPresetTemplate("Nutrition", "Nutrition Audit")}>
                  🥗 Nutrition Audit
                </button>
                <button type="button" className="preset-btn" onClick={() => applyPresetTemplate("Progress", "Body Metrics")}>
                  📈 Body Metrics
                </button>
                <button type="button" className="preset-btn" onClick={() => applyPresetTemplate("Complete", "Full System Audit")}>
                  📊 Complete Audit
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
              <div className="form-grid">
                <label>
                  Report Type
                  <select name="reportType" value={form.reportType} onChange={handleChange}>
                    {REPORT_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Generated Date
                  <input type="date" name="generatedDate" value={form.generatedDate} onChange={handleChange} required />
                </label>
              </div>

              <label style={{ display: "grid", gap: 8, fontWeight: 700, color: "var(--text)" }}>
                File Name
                <input
                  name="fileName"
                  value={form.fileName}
                  onChange={handleChange}
                  placeholder="e.g. Workout-Report-2026-08-01"
                  required
                />
              </label>

              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={generating}>
                  {generating ? (
                    <>
                      <RefreshCw size={18} className="spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Download size={18} /> Generate & Download CSV
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
