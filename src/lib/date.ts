const time = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
const dayMonth = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })
const full = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString()
}

/** "Today, 3:40 pm" · "Yesterday, 9:05 am" · "12 Sept" · "3 Jan 2025" */
export function formatRelativeDate(iso: string, now = new Date()) {
  const date = new Date(iso)
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (isSameDay(date, now)) return `Today, ${time.format(date)}`
  if (isSameDay(date, yesterday)) return `Yesterday, ${time.format(date)}`
  if (date.getFullYear() === now.getFullYear()) return dayMonth.format(date)
  return full.format(date)
}

export function formatDateTime(iso: string) {
  const date = new Date(iso)
  return `${full.format(date)}, ${time.format(date)}`
}
