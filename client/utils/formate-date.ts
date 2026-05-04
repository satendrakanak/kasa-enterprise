export const formatDate = (dateString: string) => {
  if (!dateString) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
};
