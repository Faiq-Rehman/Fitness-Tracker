import { useEffect, useMemo, useState } from "react";
import {
  Apple,
  Calendar,
  CheckCircle2,
  Coffee,
  Cookie,
  Flame,
  Moon,
  Pencil,
  Plus,
  Salad,
  Search,
  Sparkles,
  Trash2,
  Utensils,
  Wheat,
  X,
  Zap,
} from "lucide-react";
import { apiFetch } from "../utils/api.js";
import { PageHeader } from "../components/Dashboard/UI.jsx";

const EMPTY_FORM = {
  mealType: "Breakfast",
  foodName: "",
  quantity: "",
  calories: "",
  protein: "",
  carbs: "",
  fats: "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

function getMealConfig(mealType) {
  switch (mealType) {
    case "Breakfast":
      return {
        icon: <Coffee size={24} />,
        badgeClass: "meal-badge-breakfast",
        iconClass: "meal-icon-breakfast",
      };
    case "Lunch":
      return {
        icon: <Utensils size={24} />,
        badgeClass: "meal-badge-lunch",
        iconClass: "meal-icon-lunch",
      };
    case "Dinner":
      return {
        icon: <Moon size={24} />,
        badgeClass: "meal-badge-dinner",
        iconClass: "meal-icon-dinner",
      };
    case "Snack":
      return {
        icon: <Cookie size={24} />,
        badgeClass: "meal-badge-snack",
        iconClass: "meal-icon-snack",
      };
    default:
      return {
        icon: <Apple size={24} />,
        badgeClass: "meal-badge-default",
        iconClass: "meal-icon-default",
      };
  }
}

function getItemId(meal) {
  return meal._id || meal.id;
}

function formatDate(dateVal) {
  if (!dateVal) return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return dateVal;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Nutrition() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [mealFilter, setMealFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await apiFetch("/nutrition");
        const list = res?.nutrition || res?.data || (Array.isArray(res) ? res : []);
        setMeals(list);
      } catch (err) {
        console.error("Failed to load nutrition logs:", err);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const counts = useMemo(() => {
    const summary = { All: meals.length, Breakfast: 0, Lunch: 0, Dinner: 0, Snack: 0 };
    meals.forEach((m) => {
      if (summary[m.mealType] !== undefined) {
        summary[m.mealType] += 1;
      }
    });
    return summary;
  }, [meals]);

  const filteredMeals = useMemo(() => {
    const search = query.trim().toLowerCase();
    return meals.filter((meal) => {
      const matchesSearch =
        !search ||
        (meal.foodName || "").toLowerCase().includes(search) ||
        (meal.mealType || "").toLowerCase().includes(search) ||
        (meal.notes || "").toLowerCase().includes(search);
      const matchesFilter = mealFilter === "All" || meal.mealType === mealFilter;
      return matchesSearch && matchesFilter;
    });
  }, [meals, query, mealFilter]);

  const totals = useMemo(() => {
    return filteredMeals.reduce(
      (sum, meal) => ({
        calories: sum.calories + Number(meal.calories || 0),
        protein: sum.protein + Number(meal.protein || 0),
        carbs: sum.carbs + Number(meal.carbs || 0),
        fats: sum.fats + Number(meal.fats || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  }, [filteredMeals]);

  // Macro calorie ratios
  const macroBreakdown = useMemo(() => {
    const pCal = totals.protein * 4;
    const cCal = totals.carbs * 4;
    const fCal = totals.fats * 9;
    const macroTotal = pCal + cCal + fCal;

    if (macroTotal === 0) {
      return { pPct: 33.3, cPct: 33.3, fPct: 33.4, totalCal: totals.calories };
    }

    return {
      pPct: Math.round((pCal / macroTotal) * 100),
      cPct: Math.round((cCal / macroTotal) * 100),
      fPct: Math.round((fCal / macroTotal) * 100),
      totalCal: totals.calories,
    };
  }, [totals]);

  function openNewMealForm() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) });
    setMessage("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function setMealTypeSelect(type) {
    setForm((current) => ({ ...current, mealType: type }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.foodName.trim() || !form.quantity.trim()) {
      setMessage("Please enter food name and quantity.");
      return;
    }

    setIsSubmitting(true);
    const mealData = {
      mealType: form.mealType,
      foodName: form.foodName.trim(),
      quantity: form.quantity.trim(),
      calories: Number(form.calories || 0),
      protein: Number(form.protein || 0),
      carbs: Number(form.carbs || 0),
      fats: Number(form.fats || 0),
      mealDate: form.date,
      date: form.date,
      notes: form.notes.trim(),
    };

    try {
      if (editingId !== null) {
        const res = await apiFetch(`/nutrition/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(mealData),
        });
        const updatedItem = res?.nutrition || res?.data || mealData;
        setMeals((current) =>
          current.map((meal) => (getItemId(meal) === editingId ? { ...meal, ...mealData, ...updatedItem } : meal))
        );
        setMessage("Meal updated successfully!");
      } else {
        const res = await apiFetch("/nutrition", {
          method: "POST",
          body: JSON.stringify(mealData),
        });
        const newMeal = res?.nutrition || res?.data || res;
        setMeals((current) => [newMeal, ...current]);
        setMessage("Meal logged successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      window.setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message || "Error saving meal record");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(meal) {
    const id = getItemId(meal);
    setEditingId(id);
    let formattedDate = new Date().toISOString().slice(0, 10);
    if (meal.mealDate || meal.date) {
      try {
        formattedDate = new Date(meal.mealDate || meal.date).toISOString().slice(0, 10);
      } catch (e) {
        formattedDate = meal.date || meal.mealDate || formattedDate;
      }
    }

    setForm({
      mealType: meal.mealType || "Breakfast",
      foodName: meal.foodName || "",
      quantity: meal.quantity || "",
      calories: String(meal.calories ?? ""),
      protein: String(meal.protein ?? ""),
      carbs: String(meal.carbs ?? ""),
      fats: String(meal.fats ?? ""),
      date: formattedDate,
      notes: meal.notes || "",
    });
    setMessage("");
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this meal entry?")) {
      try {
        await apiFetch(`/nutrition/${id}`, { method: "DELETE" });
        setMeals((current) => current.filter((meal) => getItemId(meal) !== id));
      } catch (err) {
        alert(err.message || "Failed to delete meal");
      }
    }
  }

  // Estimated calories in form
  const estimatedFormCal = useMemo(() => {
    if (form.calories) return Number(form.calories);
    const p = Number(form.protein || 0);
    const c = Number(form.carbs || 0);
    const f = Number(form.fats || 0);
    return p * 4 + c * 4 + f * 9;
  }, [form.calories, form.protein, form.carbs, form.fats]);

  return (
    <>
      <PageHeader
        eyebrow="Nutrition Tracker"
        title="Daily Nutrition & Macros"
        description="Apne daily meals, calories aur macronutrient balance ko monitor aur track karo."
        action={
          <button type="button" className="primary-btn" onClick={openNewMealForm}>
            <Plus size={19} /> Add New Meal
          </button>
        }
      />

      {message && (
        <div className="status-message" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          <CheckCircle2 size={20} color="var(--primary)" />
          {message}
        </div>
      )}

      {/* STAT CARDS GRID */}
      <section className="nutrition-stats-grid">
        <div className="nutrition-stat-card">
          <div className="stat-icon-wrap stat-icon-calories">
            <Flame size={26} />
          </div>
          <div className="nutrition-stat-info">
            <span>Calories</span>
            <strong>{totals.calories.toLocaleString()} <small>kcal</small></strong>
            <small>Filtered intake</small>
          </div>
        </div>

        <div className="nutrition-stat-card">
          <div className="stat-icon-wrap stat-icon-protein">
            <Zap size={26} />
          </div>
          <div className="nutrition-stat-info">
            <span>Protein</span>
            <strong>{totals.protein} <small>g</small></strong>
            <small>{totals.protein * 4} kcal ({macroBreakdown.pPct}%)</small>
          </div>
        </div>

        <div className="nutrition-stat-card">
          <div className="stat-icon-wrap stat-icon-carbs">
            <Wheat size={26} />
          </div>
          <div className="nutrition-stat-info">
            <span>Carbs</span>
            <strong>{totals.carbs} <small>g</small></strong>
            <small>{totals.carbs * 4} kcal ({macroBreakdown.cPct}%)</small>
          </div>
        </div>

        <div className="nutrition-stat-card">
          <div className="stat-icon-wrap stat-icon-fats">
            <Salad size={26} />
          </div>
          <div className="nutrition-stat-info">
            <span>Fats</span>
            <strong>{totals.fats} <small>g</small></strong>
            <small>{totals.fats * 9} kcal ({macroBreakdown.fPct}%)</small>
          </div>
        </div>
      </section>

      {/* MACRO BREAKDOWN VISUAL BAR */}
      {filteredMeals.length > 0 && (
        <div className="macro-distribution-card">
          <div className="macro-header">
            <div className="macro-title">
              <Sparkles size={18} />
              <span>Macronutrient Ratio</span>
            </div>
            <span className="macro-cal-total">
              {totals.calories} total kcal logged
            </span>
          </div>

          <div className="macro-track">
            <div className="macro-segment macro-seg-protein" style={{ width: `${macroBreakdown.pPct}%` }} title={`Protein: ${macroBreakdown.pPct}%`} />
            <div className="macro-segment macro-seg-carbs" style={{ width: `${macroBreakdown.cPct}%` }} title={`Carbs: ${macroBreakdown.cPct}%`} />
            <div className="macro-segment macro-seg-fats" style={{ width: `${macroBreakdown.fPct}%` }} title={`Fats: ${macroBreakdown.fPct}%`} />
          </div>

          <div className="macro-legend">
            <div className="legend-item">
              <span className="dot dot-protein" />
              <span>Protein: {totals.protein}g ({macroBreakdown.pPct}%)</span>
            </div>
            <div className="legend-item">
              <span className="dot dot-carbs" />
              <span>Carbs: {totals.carbs}g ({macroBreakdown.cPct}%)</span>
            </div>
            <div className="legend-item">
              <span className="dot dot-fats" />
              <span>Fats: {totals.fats}g ({macroBreakdown.fPct}%)</span>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MEAL FORM */}
      {showForm && (
        <section className="card nutrition-form-card" style={{ animation: "fadeIn .3s ease" }}>
          <div className="form-heading">
            <div>
              <p className="eyebrow">{editingId !== null ? "Edit Meal Log" : "Log New Meal"}</p>
              <h2 style={{ margin: 0 }}>{editingId !== null ? "Meal record update karo" : "Apna meal add karo"}</h2>
            </div>
            <button type="button" className="icon-button" onClick={closeForm} aria-label="Close form">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="meal-entry-form" style={{ border: "none", boxShadow: "none", padding: 0 }}>
            <div className="form-grid">
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ marginBottom: 6 }}>Meal Type</label>
                <div className="meal-type-selector">
                  {[
                    { type: "Breakfast", icon: <Coffee size={17} /> },
                    { type: "Lunch", icon: <Utensils size={17} /> },
                    { type: "Dinner", icon: <Moon size={17} /> },
                    { type: "Snack", icon: <Cookie size={17} /> },
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      className={`meal-type-btn ${form.mealType === item.type ? "active" : ""}`}
                      onClick={() => setMealTypeSelect(item.type)}
                    >
                      {item.icon}
                      {item.type}
                    </button>
                  ))}
                </div>
              </div>

              <label>
                Food / Meal Name *
                <input
                  name="foodName"
                  value={form.foodName}
                  onChange={handleChange}
                  placeholder="e.g. Oatmeal with Berries & Protein"
                  required
                />
              </label>

              <label>
                Quantity / Portion *
                <input
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 1 bowl (300g)"
                  required
                />
              </label>

              <label>
                Date *
                <input type="date" name="date" value={form.date} onChange={handleChange} required />
              </label>

              <label>
                Calories (kcal) *
                <input
                  type="number"
                  min="0"
                  name="calories"
                  value={form.calories}
                  onChange={handleChange}
                  placeholder="e.g. 450"
                  required
                />
              </label>

              <label>
                Protein (g)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="protein"
                  value={form.protein}
                  onChange={handleChange}
                  placeholder="e.g. 30"
                />
              </label>

              <label>
                Carbs (g)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="carbs"
                  value={form.carbs}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                />
              </label>

              <label>
                Fats (g)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="fats"
                  value={form.fats}
                  onChange={handleChange}
                  placeholder="e.g. 12"
                />
              </label>

              <div className="form-macro-preview">
                <span>
                  <Flame size={16} color="#f59e0b" /> Estimated Energy:
                </span>
                <strong>{estimatedFormCal} kcal</strong>
              </div>
            </div>

            <label style={{ marginTop: 14 }}>
              Notes (Optional)
              <textarea
                name="notes"
                rows="3"
                value={form.notes}
                onChange={handleChange}
                placeholder="Add details like recipes, ingredients, or timing..."
              />
            </label>

            <div className="form-actions">
              <button type="button" className="secondary-btn" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="primary-btn" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingId !== null ? "Update Meal" : "Save Meal"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* SEARCH AND FILTER TOOLBAR */}
      <div className="nutrition-toolbar">
        <div className="nutrition-search">
          <Search size={18} color="var(--muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meals, food items, or notes..."
          />
          {query && (
            <button type="button" className="clear-search-btn" onClick={() => setQuery("")} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="filter-pills">
          {["All", "Breakfast", "Lunch", "Dinner", "Snack"].map((type) => (
            <button
              key={type}
              type="button"
              className={`filter-pill ${mealFilter === type ? "active" : ""}`}
              onClick={() => setMealFilter(type)}
            >
              {type === "Breakfast" && <Coffee size={14} />}
              {type === "Lunch" && <Utensils size={14} />}
              {type === "Dinner" && <Moon size={14} />}
              {type === "Snack" && <Cookie size={14} />}
              <span>{type === "All" ? "All Meals" : type}</span>
              <span className="pill-count">{counts[type] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MEALS LIST / SKELETON / EMPTY STATE */}
      {loading ? (
        <div className="nutrition-cards-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="meal-card-item skeleton-box" style={{ height: 120 }} />
          ))}
        </div>
      ) : filteredMeals.length === 0 ? (
        <section className="card emptyState" style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--primary-soft)", color: "var(--primary)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
            <Utensils size={30} />
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>
            {query || mealFilter !== "All" ? "No matching meals found" : "No meals logged yet"}
          </h3>
          <p style={{ color: "var(--muted)", maxWidth: 440, margin: "0 auto 20px", lineHeight: 1.6 }}>
            {query || mealFilter !== "All"
              ? "Search or filter change karke check karo."
              : "Apna daily food intake track karne ke liye Add New Meal button se apna pehla meal enter karo."}
          </p>
          {!query && mealFilter === "All" && (
            <button type="button" className="primary-btn" onClick={openNewMealForm} style={{ margin: "0 auto" }}>
              <Plus size={18} /> Add Your First Meal
            </button>
          )}
        </section>
      ) : (
        <div className="nutrition-cards-grid">
          {filteredMeals.map((meal) => {
            const id = getItemId(meal);
            const cfg = getMealConfig(meal.mealType);
            return (
              <article className="meal-card-item" key={id}>
                <div className={`meal-card-icon ${cfg.iconClass}`}>{cfg.icon}</div>

                <div className="meal-card-body">
                  <div className="meal-card-header">
                    <span className={`meal-badge ${cfg.badgeClass}`}>{meal.mealType}</span>
                    <h3 className="meal-card-title">{meal.foodName}</h3>
                  </div>

                  <div className="meal-meta-row">
                    <span className="meal-meta-item">
                      <Utensils size={14} /> {meal.quantity}
                    </span>
                    <span className="meal-meta-item">
                      <Calendar size={14} /> {formatDate(meal.mealDate || meal.date)}
                    </span>
                  </div>

                  <div className="macro-chips-grid">
                    <span className="macro-chip macro-chip-cal">
                      <Flame size={14} /> {meal.calories || 0} kcal
                    </span>
                    {meal.protein > 0 && (
                      <span className="macro-chip macro-chip-protein">
                        <Zap size={14} /> {meal.protein}g protein
                      </span>
                    )}
                    {meal.carbs > 0 && (
                      <span className="macro-chip macro-chip-carbs">
                        <Wheat size={14} /> {meal.carbs}g carbs
                      </span>
                    )}
                    {meal.fats > 0 && (
                      <span className="macro-chip macro-chip-fats">
                        <Salad size={14} /> {meal.fats}g fats
                      </span>
                    )}
                  </div>

                  {meal.notes && <div className="meal-notes-box">"{meal.notes}"</div>}
                </div>

                <div className="meal-card-actions">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => handleEdit(meal)}
                    aria-label="Edit meal"
                    title="Edit Meal"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    className="icon-button danger"
                    onClick={() => handleDelete(id)}
                    aria-label="Delete meal"
                    title="Delete Meal"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
