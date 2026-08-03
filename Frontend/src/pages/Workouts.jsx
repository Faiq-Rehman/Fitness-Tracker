import { useEffect, useMemo, useState } from 'react';
import { Dumbbell, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { apiFetch } from '../utils/api.js';
import { EmptyState, PageHeader } from '../components/Dashboard/UI.jsx';

const emptyForm = {
  name: '',
  category: 'Strength',
  exerciseName: '',
  sets: '',
  reps: '',
  weight: '',
  duration: '',
  date: '',
  notes: '',
};

export default function Workouts() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch('/workouts');
        setItems(res.data || res.workouts || res || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return items.filter((workout) => {
      const matchesSearch =
        !search ||
        String(workout.name || '').toLowerCase().includes(search) ||
        String(workout.exerciseName || '').toLowerCase().includes(search);
      const matchesCategory = category === 'All' || workout.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [items, query, category]);

  const openNewForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setMessage('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.exerciseName.trim() || Number(form.duration) < 1) {
      setMessage('Workout name, exercise name aur valid duration required hain.');
      return;
    }

    const record = {
      name: form.name.trim(),
      category: form.category,
      exerciseName: form.exerciseName.trim(),
      sets: Number(form.sets) || 0,
      reps: Number(form.reps) || 0,
      weight: Number(form.weight) || 0,
      duration: `${Number(form.duration)} min`,
      date: form.date || new Date().toISOString().slice(0, 10),
      notes: form.notes.trim(),
      exercises: 1,
    };

    try {
      if (editingId !== null) {
        const updated = await apiFetch(`/workouts/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(record)
        });
        setItems((current) =>
          current.map((workout) =>
            workout._id === editingId || workout.id === editingId ? { ...workout, ...record, ...updated.data } : workout,
          ),
        );
        setMessage('Workout update ho gaya.');
      } else {
        const created = await apiFetch('/workouts', {
          method: 'POST',
          body: JSON.stringify(record)
        });
        const newWorkout = created.data || created.workout || created;
        setItems((current) => [newWorkout, ...current]);
        setMessage('Workout add ho gaya.');
      }
      window.setTimeout(closeForm, 650);
    } catch (err) {
      setMessage(err.message || 'Error occurred');
    }
  };

  const handleEdit = (workout) => {
    setEditingId(workout._id || workout.id);
    setForm({
      name: workout.name || '',
      category: workout.category || 'Strength',
      exerciseName: workout.exerciseName || workout.name || '',
      sets: workout.sets || '',
      reps: workout.reps || '',
      weight: workout.weight || '',
      duration: String(workout.duration || '').replace(/[^0-9.]/g, ''),
      date: /^\d{4}-\d{2}-\d{2}$/.test(workout.date || '') ? workout.date : '',
      notes: workout.notes || '',
    });
    setMessage('');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Kya tum ye workout delete karna chahte ho?')) {
      try {
        await apiFetch(`/workouts/${id}`, { method: 'DELETE' });
        setItems((current) => current.filter((workout) => workout._id !== id && workout.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };


  return (
    <>
      <PageHeader
        eyebrow="Training"
        title="Workout routines"
        description="Create, organize and manage your workouts."
        action={
          <button type="button" className="primary-btn" onClick={openNewForm}>
            <Plus size={18} /> New Workout
          </button>
        }
      />

      {showForm && (
        <section className="card workout-form-card">
          <div className="form-heading">
            <div>
              <p className="eyebrow">{editingId !== null ? 'Edit Workout' : 'New Workout'}</p>
              <h2>{editingId !== null ? 'Workout update karo' : 'Workout details enter karo'}</h2>
            </div>
            <button type="button" className="icon-button" onClick={closeForm} aria-label="Close form">
              <X size={19} />
            </button>
          </div>

          {message && <div className="status-message">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Workout Name
                <input name="name" value={form.name} onChange={handleChange} placeholder="Push Day" required />
              </label>
              <label>
                Category
                <select name="category" value={form.category} onChange={handleChange}>
                  <option>Strength</option>
                  <option>Cardio</option>
                  <option>Flexibility</option>
                  <option>Sports</option>
                </select>
              </label>
              <label>
                Exercise Name
                <input name="exerciseName" value={form.exerciseName} onChange={handleChange} placeholder="Bench Press" required />
              </label>
              <label>
                Date
                <input type="date" name="date" value={form.date} onChange={handleChange} />
              </label>
              <label>
                Sets
                <input type="number" min="0" name="sets" value={form.sets} onChange={handleChange} placeholder="4" />
              </label>
              <label>
                Reps
                <input type="number" min="0" name="reps" value={form.reps} onChange={handleChange} placeholder="10" />
              </label>
              <label>
                Weight (KG)
                <input type="number" min="0" step="0.1" name="weight" value={form.weight} onChange={handleChange} placeholder="50" />
              </label>
              <label>
                Duration (minutes)
                <input type="number" min="1" name="duration" value={form.duration} onChange={handleChange} placeholder="45" required />
              </label>
            </div>
            <label>
              Notes
              <textarea name="notes" rows="4" value={form.notes} onChange={handleChange} placeholder="Workout related notes..." />
            </label>
            <div className="form-actions">
              <button type="button" className="secondary-btn" onClick={closeForm}>Cancel</button>
              <button type="submit" className="primary-btn">{editingId !== null ? 'Update Workout' : 'Save Workout'}</button>
            </div>
          </form>
        </section>
      )}

      <div className="toolbar card">
        <div className="search-box">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search workouts..." />
        </div>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="All">All categories</option>
          <option>Strength</option>
          <option>Cardio</option>
          <option>Flexibility</option>
          <option>Sports</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No workouts found" text="New Workout button se workout add karo." />
      ) : (
        <div className="cards-list">
          {filtered.map((workout) => (
            <article className="card routine-card" key={workout.id}>
              <div className="routine-icon"><Dumbbell /></div>
              <div className="grow">
                <span className="badge">{workout.category}</span>
                <h3>{workout.name}</h3>
                <p>{workout.exerciseName || `${workout.exercises || 1} exercises`} · {workout.duration} · {workout.date}</p>
                <div className="workout-details">
                  {Number(workout.sets) > 0 && <span>{workout.sets} sets</span>}
                  {Number(workout.reps) > 0 && <span>{workout.reps} reps</span>}
                  {Number(workout.weight) > 0 && <span>{workout.weight} kg</span>}
                </div>
                {workout.notes && <p className="workout-notes">{workout.notes}</p>}
              </div>
              <div className="routine-actions">
                <button type="button" className="icon-button" onClick={() => handleEdit(workout)} aria-label="Edit workout"><Pencil size={18} /></button>
                <button type="button" className="icon-button danger" onClick={() => handleDelete(workout.id)} aria-label="Delete workout"><Trash2 size={18} /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

