/** "Strength & Conditioning!" → "strength-conditioning". Matches the database's slug format. */
export function slugify(text: string) {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
