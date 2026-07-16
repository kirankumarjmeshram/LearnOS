export function formatDate(value, options = {}) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", ...options }).format(new Date(value));
}
