import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'

/* Stand-in for pages that haven't been built yet, so every nav link resolves. */
export function PageStub({ title }: { title: string }) {
  return (
    <>
      <Seo title={title} />
      <Container className="pt-40 pb-32">
        <h1 className="type-display text-display">{title}</h1>
      </Container>
    </>
  )
}
