interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}

export default function Slider({ label, value, min, max, step = 1, unit, onChange, format }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-ink-soft">{label}</span>
        <span className="font-semibold tabular-nums text-ink">
          {format ? format(value) : value}
          {unit ? ` ${unit}` : ''}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#1f4fbf]"
      />
    </label>
  );
}
