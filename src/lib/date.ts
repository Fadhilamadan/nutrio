const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export function dateKey(value: string): string {
  const input = new Date(value);
  if (Number.isNaN(input.getTime())) return "";
  return input.toISOString().slice(0, 10);
}

export function displayMealDate(value: string): string {
  if (!value) return "";
  const input = new Date(value);
  if (Number.isNaN(input.getTime())) return "";
  const day = String(input.getUTCDate()).padStart(2, "0");
  const month = months[input.getUTCMonth()];
  const year = input.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export function displayMealTime(value: string): string {
  if (!value) return "";
  const input = new Date(value);
  if (Number.isNaN(input.getTime())) return "";
  return input.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
