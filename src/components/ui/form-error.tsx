type FormErrorProps = {
  message?: string | null;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--danger)_24%,var(--hairline))] bg-[color-mix(in_srgb,var(--danger)_8%,var(--surface))] px-4 py-3">
      <p className="text-sm leading-5 text-[var(--danger)]">{message}</p>
    </div>
  );
}
