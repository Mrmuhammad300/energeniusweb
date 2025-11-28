import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { name, email, phone, location, projectType, powerNeeds, timeline, message, interestedProducts } =
      await request.json()

    if (!name || !email || !phone || !location || !projectType || !powerNeeds || !timeline) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    await prisma.quoteRequest.create({
      data: {
        name,
        email,
        phone,
        location,
        projectType,
        powerNeeds,
        timeline,
        message: message || null,
        interestedProducts: interestedProducts || [],
      },
    })

    return NextResponse.json(
      { message: 'Quote request submitted successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Quote request error:', error)
    return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 })
  }
}
