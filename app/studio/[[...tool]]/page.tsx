import StudioClient from './StudioClient'

export { viewport, metadata } from 'next-sanity/studio'

export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <StudioClient />
}
