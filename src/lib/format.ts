const npr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** 30000 → "NPR 30,000" (Nepali/Indian digit grouping). */
export function formatNpr(amount: number) {
  return `NPR ${npr.format(amount)}`
}

export function splitLines(text: string) {
  return text.split('\n').map((line) => line.trim()).filter(Boolean)
}
