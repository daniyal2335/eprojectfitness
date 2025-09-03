import React from "react";

export default function ExerciseList({ exercises, setExercises, errors }) {
  const updateExercise = (index, key, value) => {
    const newExercises = [...exercises];
    newExercises[index][key] = value;
    setExercises(newExercises);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: "", sets: "", reps: "", weight: "", notes: "" },
    ]);
  };

  return (
    <div className="space-y-3">
      <p className="font-medium">Exercises</p>

      <table className="w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-center">Sets</th>
            <th className="p-2 text-center">Reps</th>
            <th className="p-2 text-center">Weight (kg)</th>
            <th className="p-2 text-left">Notes</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">
                <input
                  className="w-full border rounded px-2 py-1"
                  placeholder="Name"
                  value={ex.name}
                  onChange={(e) => updateExercise(i, "name", e.target.value)}
                />
                {errors[`exercise-${i}-name`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`exercise-${i}-name`]}
                  </p>
                )}
              </td>
              <td className="p-2 text-center">
                <input
                  type="number"
                  min={0}
                  className="w-16 border rounded px-2 py-1 text-center"
                  placeholder="0"
                  value={ex.sets}
                  onChange={(e) => updateExercise(i, "sets", Number(e.target.value))}
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="number"
                  min={0}
                  className="w-16 border rounded px-2 py-1 text-center"
                  placeholder="0"
                  value={ex.reps}
                  onChange={(e) => updateExercise(i, "reps", Number(e.target.value))}
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="number"
                  min={0}
                  className="w-20 border rounded px-2 py-1 text-center"
                  placeholder="0"
                  value={ex.weight}
                  onChange={(e) => updateExercise(i, "weight", Number(e.target.value))}
                />
              </td>
              <td className="p-2">
                <input
                  className="w-full border rounded px-2 py-1"
                  placeholder="Notes"
                  value={ex.notes}
                  onChange={(e) => updateExercise(i, "notes", e.target.value)}
                />
              </td>
              <td className="p-2 text-center">
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs shadow"
                  onClick={() => removeExercise(i)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow"
        onClick={addExercise}
      >
        + Add Exercise
      </button>
    </div>
  );
}
