import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { AlertTriangle } from "lucide-react";

export function WeeklyWorkoutsChart({ data }) {
  const d = (data || []).map(w => ({
    ...w,
    performedAtLabel: new Date(w.performedAt).toLocaleDateString()
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Weekly Workouts</h3>

      {d.length === 0 ? (
        <div className="flex items-center text-yellow-600 bg-yellow-50 p-3 rounded-lg">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>No workout data available</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={d}>
            <XAxis dataKey="performedAtLabel" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calories" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function WeightProgressChart({ data }) {
  const d = (data || []).map(w => ({
    ...w,
    label: new Date(w.recordedAt).toLocaleDateString()
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">⚖️ Weight Progress</h3>

      {d.length === 0 ? (
        <div className="flex items-center text-yellow-600 bg-yellow-50 p-3 rounded-lg">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>No weight progress data available</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={d}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
