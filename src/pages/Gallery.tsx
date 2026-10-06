import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { galleryCategoryLabel, useGallery } from '../api/gallery'
import { Lightbox } from '../components/media/Lightbox'
import { ResponsiveImage } from '../components/media/ResponsiveImage'
import { PageHeader } from '../components/sections/PageHeader'
import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { pages } from '../content/pages'
import { cn } from '../lib/cn'
import type { GalleryCategory } from '../types/content'

export default function Gallery() {
  const all = useGallery()
  const [params, setParams] = useSearchParams()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Only offer filters that actually have photos.
  const categories = [...new Set(all.map((item) => item.category))]
  const active = categories.find((category) => category === params.get('category')) ?? null
  const items = active ? all.filter((item) => item.category === active) : all

  const select = (category: GalleryCategory | null) => {
    setParams(category ? { category } : {}, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <Seo title="Gallery" description={pages.gallery.seoDescription} />
      <PageHeader title={pages.gallery.title} intro={pages.gallery.intro} />

      <Container className="py-12 md:py-20">
        {categories.length > 1 && (
          <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter photos">
            {[null, ...categories].map((category) => (
              <button
                key={category ?? 'all'}
                type="button"
                aria-pressed={active === category}
                onClick={() => select(category)}
                className={cn(
                  'h-10 border px-4 text-sm transition-colors',
                  active === category ? 'border-chalk bg-chalk text-graphite' : 'border-chalk/25 hover:border-chalk/60',
                )}
              >
                {category ? galleryCategoryLabel[category] : 'All'}
              </button>
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <p className="py-20 text-center text-chalk/60">Photos are coming soon.</p>
        ) : (
          <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {items.map((item, index) => (
              <li key={item.id} className="mb-4 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Open photo: ${item.image.alt}`}
                  className="group block w-full overflow-hidden bg-iron text-left"
                >
                  <ResponsiveImage
                    image={item.image}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full transition-transform duration-700 ease-out-strong group-hover:scale-[1.03]"
                  />
                </button>
                {item.caption && <p className="mt-2 text-sm text-chalk/60">{item.caption}</p>}
              </li>
            ))}
          </ul>
        )}
      </Container>

      <Lightbox items={items} index={openIndex} onIndexChange={setOpenIndex} />
    </>
  )
}
