"use client";

export type CategoryOption = { key: string; label: string };

export type CategoryFilterProps = {
  options: readonly CategoryOption[];
  value: "all" | string;
  onChange: (next: "all" | string) => void;
  allLabel: string;
};

export default function CategoryFilter({
  options,
  value,
  onChange,
  allLabel,
}: CategoryFilterProps) {
  const base =
    "w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";
  const active = "bg-blue-600 text-white shadow-sm dark:bg-blue-500";
  const idle =
    "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-800";

  return (
    <nav className="space-y-1" aria-label={allLabel}>
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`${base} ${value === "all" ? active : idle}`}
      >
        {allLabel}
      </button>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`${base} ${value === opt.key ? active : idle}`}
        >
          {opt.label}
        </button>
      ))}
    </nav>
  );
}
