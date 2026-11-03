export function formatTime(seconds?: number) {
  const total = Math.max(0, Math.floor(seconds ?? 0))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}
