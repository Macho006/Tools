export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let b = bytes;
  let i = 0;
  while (b >= 1024 && i < units.length - 1) {
    b /= 1024;
    i++;
  }
  return `${b.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

export function percentSaved(original: number, compressed: number): number {
  if (!original) return 0;
  return Math.max(0, Math.min(100, ((original - compressed) / original) * 100));
}
