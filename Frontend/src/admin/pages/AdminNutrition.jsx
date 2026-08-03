import { useEffect, useState } from 'react';
import { Salad } from 'lucide-react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StatCard from '../../components/StatCard.jsx';
import DataTable from '../../components/DataTable.jsx';
import { getAuthHeader } from '../../utils/auth.js';

const API_BASE = '/api/admin';

export default function AdminNutrition() {
  const [overview, setOverview] = useState(null);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const [overviewRes, nutritionRes] = await Promise.all([
          fetch(`${API_BASE}/overview`, { headers: { ...(getAuthHeader()), 'Content-Type': 'application/json' } }),
          fetch(`${API_BASE}/nutrition`, { headers: { ...(getAuthHeader()), 'Content-Type': 'application/json' } }),
        ]);

        const overviewData = await overviewRes.json();
        const nutritionData = await nutritionRes.json();

        if (!overviewRes.ok) throw new Error(overviewData.message || 'Unable to load overview');
        if (!nutritionRes.ok) throw new Error(nutritionData.message || 'Unable to load nutrition logs');

        setOverview(overviewData.overview || null);
        setNutritionLogs((nutritionData.nutrition || []).map((item) => ({
          ...item,
          id: item._id,
          user: item.userId?.fullName || item.userId?.username || 'User',
          meal: item.mealType,
          food: item.foodName,
          quantity: item.quantity,
          date: item.mealDate ? new Date(item.mealDate).toLocaleString() : 'Unknown',
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const averageCalories = nutritionLogs.length > 0
    ? Math.round(nutritionLogs.reduce((sum, r) => sum + (Number(r.calories) || 0), 0) / nutritionLogs.length)
    : 0;

  return (
    <>
      <PageHeader eyebrow="Admin Nutrition" title="Nutrition Logs" text="Track meal logs, calories and macronutrient trends across users." action={<button className="btn adminPrimary">Refresh</button>} />
      <div className="statsGrid">
        <StatCard icon={<Salad />} label="Total Meal Logs" value={overview ? String(overview.totalNutrition) : loading ? 'Loading…' : '0'} trend="All users" />
        <StatCard icon={<Salad />} label="Avg Calories" value={`${averageCalories} kcal`} trend="Per entry" />
        <StatCard icon={<Salad />} label="Avg Protein" value="Calculated" trend="Per entry" />
        <StatCard icon={<Salad />} label="Reported Users" value={overview ? String(overview.totalUsers) : loading ? 'Loading…' : '0'} trend="Active" />
      </div>
      <Panel>
        {error && <div className="errorBox">{error}</div>}
        <DataTable
          columns={[
            { key: 'user', label: 'User' },
            { key: 'meal', label: 'Meal' },
            { key: 'food', label: 'Food' },
            { key: 'quantity', label: 'Quantity' },
            { key: 'calories', label: 'Calories' },
            { key: 'protein', label: 'Protein' },
            { key: 'carbs', label: 'Carbs' },
            { key: 'fats', label: 'Fats' },
            { key: 'date', label: 'Logged At' },
          ]}
          rows={nutritionLogs}
        />
      </Panel>
    </>
  );
}
