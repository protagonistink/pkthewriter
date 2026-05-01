import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookBody = {
  _type: string
  slug?: { current: string }
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookBody>(
      req,
      process.env.SANITY_WEBHOOK_SECRET,
    )

    if (isValidSignature === false) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    if (!body?._type) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    const { _type, slug } = body

    switch (_type) {
      case 'project':
        revalidatePath('/work')
        revalidatePath('/')                                 // landing feature cards
        if (slug?.current) revalidatePath(`/work/${slug.current}`)
        break
      case 'writingClip':
        revalidatePath('/writing')
        revalidatePath('/')
        break
      case 'screenplay':
        revalidatePath('/screenwriting')
        break
      case 'aboutPage':
        revalidatePath('/about')
        break
      case 'suggestionSet':
        revalidatePath('/')
        break
      default:
        revalidatePath('/', 'layout')                      // catch-all
    }

    return NextResponse.json({ revalidated: true, type: _type, slug: slug?.current ?? null })
  } catch (err) {
    console.error('[revalidate]', err)
    return NextResponse.json({ message: String(err) }, { status: 500 })
  }
}
