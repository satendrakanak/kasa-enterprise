export function SwitchRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked?: boolean;
  onChange: (val: boolean) => void;
}) {
  const isChecked = Boolean(checked);

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-2xl border px-4 py-4 transition ${
        isChecked
          ? "border-blue-100 bg-blue-50/80 dark:border-rose-200/20 dark:bg-rose-200/10"
          : "border-slate-100 bg-slate-50/80 dark:border-white/10 dark:bg-[#0b1628]"
      }`}
    >
      <div className="min-w-0">
        <span className="text-sm font-semibold text-slate-950 dark:text-white">
          {label}
        </span>

        {description ? (
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={() => onChange(!isChecked)}
        className={`mt-1 flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-1 transition ${
          isChecked
            ? "bg-blue-600 dark:bg-rose-200"
            : "bg-slate-300 dark:bg-white/20"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow transition ${
            isChecked
              ? "translate-x-5 dark:bg-black"
              : "translate-x-0 dark:bg-white"
          }`}
        />
      </button>
    </div>
  );
}
