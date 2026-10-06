import type { Image } from '../../../types/content'
import { describeError } from '../../api/content'
import { useSaveSection, type SectionKey } from '../../api/sections'
import { toast } from '../../toast'

/* Saves a page section, cleans up replaced photos and confirms. Returns true on success. */
export function useSectionSubmit(key: SectionKey, title: string) {
  const save = useSaveSection()
  return async (content: unknown, images?: { before: (Image | null | undefined)[]; after: (Image | null | undefined)[] }) => {
    try {
      await save.mutateAsync({ key, content, images })
      toast.success(`${title} saved. The website is updated.`)
      return true
    } catch (error) {
      toast.error(describeError(error, `${title} didn’t save. Try again.`))
      return false
    }
  }
}
