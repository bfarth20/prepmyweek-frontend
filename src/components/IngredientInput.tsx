import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input"; // adjust if needed
import API_BASE_URL from "@/lib/config";

export default function IngredientInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (newValue: string) => void;
}) {
  const [input, setInput] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (input.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    fetch(
      `${API_BASE_URL}/ingredients/suggest?q=${encodeURIComponent(input)}`,
      {
        signal: controller.signal,
      }
    )
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort();
  }, [input]);

  const handleSelect = (name: string) => {
    setInput(name);
    onChange(name);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <Input
        placeholder="Ingredient name"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          onChange(e.target.value);
        }}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded-md w-full shadow-lg max-h-40 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSelect(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
