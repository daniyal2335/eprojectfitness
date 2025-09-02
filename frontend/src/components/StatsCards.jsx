import { Dumbbell, Flame, Clock } from "lucide-react";

export default function StatsCards({ stats }){
  const items = [
    { label:'Total Workouts', value: stats.totalWorkouts, icon: <Dumbbell/> },
    { label:'Calories Burned', value: stats.caloriesBurned, icon: <Flame/> },
    { label:'Hours Trained', value: stats.hoursTrained?.toFixed?.(1) ?? stats.hoursTrained, icon: <Clock/> },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((it,i)=>(
        <div key={i} className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gray-100">{it.icon}</div>
          <div>
            <p className="text-gray-500">{it.label}</p>
            <h2 className="text-2xl font-bold">{it.value ?? 0}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}
