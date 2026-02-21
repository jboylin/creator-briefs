import { useState } from "react";

type Props = {
  onAdd: (idea: string) => void;
}

export default function IdeaInput({ onAdd }: Props) {
  const [value, setValue] = useState("");

  function handleAdd() {
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  }

  return (
    <div className="mb-4">
      <input 
        value={value}
        type="text"
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter content idea..."
        style={{ width: "100%", padding: 8 }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAdd();
          }
        }}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
      />
      <button onClick={handleAdd} style={{ marginTop: 10 }} className="mt-2 w-full bg-black text-white py-2 rounded-lg hover:opacity-90">Add Idea</button>
    </div>
  )
}