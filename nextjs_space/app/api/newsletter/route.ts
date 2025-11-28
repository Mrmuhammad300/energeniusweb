import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, name, source } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
      } else {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { status: 'active' },
        })
        return NextResponse.json({ message: 'Subscription reactivated' }, { status: 200 })
      }
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email,
        name: name || null,
        source: source || 'website',
      },
    })

    return NextResponse.json({ message: 'Successfully subscribed' }, { status: 201 })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
