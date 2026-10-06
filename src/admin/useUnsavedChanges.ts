import { useCallback, useEffect, useRef } from 'react'
import { useBlocker } from 'react-router'

const MESSAGE = 'You have unsaved changes. Leave without saving?'

/*
  Warns before leaving a form with unsaved edits: in-app navigation via the
  router, and closing or reloading the tab via beforeunload. Call
  allowNavigation() right before navigating away after a successful save.
*/
export function useUnsavedChanges(isDirty: boolean) {
  const allowed = useRef(false)

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !allowed.current && currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    if (blocker.state !== 'blocked') return
    if (window.confirm(MESSAGE)) blocker.proceed()
    else blocker.reset()
  }, [blocker])

  useEffect(() => {
    if (!isDirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  return {
    allowNavigation: useCallback(() => {
      allowed.current = true
    }, []),
  }
}
