"use client";

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder,
  className = "",
}: SearchBarProps) {
  return (
    <label className={`block w-full ${className}`}>
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100 dark:placeholder:text-neutral-500"
      />
    </label>
  );
}
