"use client";

type QuantitySelectorProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        −
      </button>
      <span
        className="w-10 text-center text-sm font-medium text-gray-900 select-none"
        aria-live="polite"
        aria-label={`Quantity: ${value}`}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
    </div>
  );
}
