import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';

export function WeeklyWorkoutsChart({ data }){
  const d = (data||[]).map(w=>({ ...w, performedAtLabel: new Date(w.performedAt).toLocaleDateString() }));
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">Weekly Workouts</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={d}>
          <XAxis dataKey="performedAtLabel" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="calories" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WeightProgressChart({ data }){
  const d = (data||[]).map(w=>({ ...w, label: new Date(w.recordedAt).toLocaleDateString() }));
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">Weight Progress</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={d}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
