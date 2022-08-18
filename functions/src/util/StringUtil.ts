export function clampText(text: string, count: number) {
  return text.slice(0, count) + (text.length > count ? "..." : "");
}

export function isEmpty(text: string | null | undefined) {
  return (text ?? "").trim() === "";
}
