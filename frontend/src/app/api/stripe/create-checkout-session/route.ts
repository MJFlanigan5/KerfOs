import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Server-side price ID map — set these in Vercel env vars
const PRICE_IDS: Record<string, string | undefined> = {
  hobbyist: process.env.STRIPE_PRICE_HOBBYIST,
  pro:      process.env.STRIPE_PRICE_PRO,
  shop:     process.env.STRIPE_PRICE_SHOP,
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    const body = await req.json()
    const { plan, price_id, success_url, cancel_url, customer_email } = body

    // Accept either a plan slug or a direct price_id
    let priceId = price_id
    if (!priceId && plan) {
      priceId = PRICE_IDS[plan]
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan or missing price ID' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || 'https://kerfos.com'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: success_url || `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  cancel_url  || `${origin}/pricing`,
      ...(customer_email && { customer_email }),
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      subscription_data: {
        metadata: { plan: plan || 'unknown' },
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 })
  }
}
