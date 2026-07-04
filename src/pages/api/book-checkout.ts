import type { APIRoute } from 'astro';

export const prerender = false;

interface CFLocals {
  runtime: { env: Record<string, string> };
}

const BOOK = {
  formats: {
    paperback: { label: 'The Shadow of a Figure of Light — Signed Paperback', cents: 2495 },
    hardcover: { label: 'The Shadow of a Figure of Light — Signed Hardcover', cents: 3900 },
  } as Record<string, { label: string; cents: number }>,
  shippingCents: 500,
  maxQty: 5,
  description: 'Signed by the author. Ships within 2–3 business days. US shipping only.',
};

interface CheckoutRequest {
  format: string;
  quantity: number | string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as unknown as CFLocals).runtime?.env ?? {};
  const secret = env.STRIPE_SECRET_KEY ?? import.meta.env.STRIPE_SECRET_KEY ?? '';

  if (!secret) {
    return json({ error: 'Checkout is not configured yet.' }, 503);
  }

  let body: CheckoutRequest;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const format = BOOK.formats[body.format];
  if (!format) {
    return json({ error: 'Please choose a format.' }, 400);
  }

  const quantity = Math.trunc(Number(body.quantity));
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > BOOK.maxQty) {
    return json({ error: `Quantity must be between 1 and ${BOOK.maxQty}.` }, 400);
  }

  const origin = new URL(request.url).origin;

  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('line_items[0][price_data][currency]', 'usd');
  params.set('line_items[0][price_data][product_data][name]', format.label);
  params.set('line_items[0][price_data][product_data][description]', BOOK.description);
  params.set('line_items[0][price_data][unit_amount]', String(format.cents));
  params.set('line_items[0][quantity]', String(quantity));

  // Stripe collects the shipping address; flat-rate Media Mail, US only.
  params.set('shipping_address_collection[allowed_countries][0]', 'US');
  params.set('shipping_options[0][shipping_rate_data][display_name]', 'USPS Media Mail (flat rate)');
  params.set('shipping_options[0][shipping_rate_data][type]', 'fixed_amount');
  params.set('shipping_options[0][shipping_rate_data][fixed_amount][amount]', String(BOOK.shippingCents));
  params.set('shipping_options[0][shipping_rate_data][fixed_amount][currency]', 'usd');

  // Inscription request captured at checkout instead of a separate form.
  params.set('custom_fields[0][key]', 'inscription');
  params.set('custom_fields[0][label][type]', 'custom');
  params.set('custom_fields[0][label][custom]', 'Inscription request (optional)');
  params.set('custom_fields[0][type]', 'text');
  params.set('custom_fields[0][optional]', 'true');

  params.set('success_url', `${origin}/book/thanks/?session_id={CHECKOUT_SESSION_ID}`);
  params.set('cancel_url', `${origin}/book/`);
  params.set('metadata[source]', 'cody_peterson_book');
  params.set('metadata[format]', body.format);
  params.set('metadata[quantity]', String(quantity));
  // Same account-level quirk as seba.health: Adaptive Pricing is force-on and
  // would convert to local currency; disable per-session to keep USD amounts.
  params.set('adaptive_pricing[enabled]', 'false');

  let stripeRes: Response;
  try {
    stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
  } catch {
    return json({ error: 'Could not reach the payment processor.' }, 502);
  }

  const data = (await stripeRes.json()) as { url?: string; error?: { message?: string } };
  if (!stripeRes.ok || !data.url) {
    console.error('[book-checkout] Stripe error:', data.error?.message ?? stripeRes.status);
    return json({ error: 'Could not start checkout. Please try again.' }, 502);
  }

  return json({ url: data.url });
};
