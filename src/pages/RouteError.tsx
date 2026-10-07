import { CtaLink } from '../components/ui/CtaLink'
import { telHref, whatsappHref } from '../lib/contact'

/*
  Last-resort screen when a route throws while loading or rendering, e.g. the
  database is unreachable. It must not depend on any fetched data, so the
  contact details come from the build-time snapshot in __CONTACT_FALLBACK__.
*/
export function RouteError() {
  const contact = __CONTACT_FALLBACK__

  return (
    <div className="mx-auto max-w-xl px-4 pt-40 pb-32">
      {contact && <p className="type-display text-2xl">{contact.name}</p>}
      <h1 className="type-display mt-6 text-headline">This page didn’t load</h1>
      <p className="mt-6 text-chalk/70">
        Check your connection and reload the page. If it keeps happening, try again in a few minutes
        {contact ? ', or call or message us directly.' : '.'}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-12 items-center bg-accent px-6 text-sm font-semibold text-accent-ink"
        >
          Reload page
        </button>
        {contact && (
          <>
            <CtaLink to={whatsappHref(contact)} variant="outline">
              WhatsApp us
            </CtaLink>
            <CtaLink to={telHref(contact.phone)} variant="outline">
              Call {contact.phone}
            </CtaLink>
          </>
        )}
      </div>
    </div>
  )
}
