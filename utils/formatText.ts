// Leqa © 2025 Mithula Chanthuka

export type TextCase = "title" | "upper" | "lower";

export function formatText(text: string, type: TextCase = "title"): string {
  if (!text) return "";

  const trimmed = text.trim();

  switch (type) {
    case "upper":
      return trimmed.toUpperCase();

    case "lower":
      return trimmed.toLowerCase();

    case "title":
    default:
      return trimmed
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
}
