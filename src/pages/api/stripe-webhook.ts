import type { APIRoute } from 'astro';

export const prerender = false;

interface CFLocals {
  runtime: { env: Record<string, unknown> };
}

interface SendEmailBinding {
  send(message: unknown): Promise<void>;
}

/**
 * Order notifications land at the first of these that is a verified
 * Email Routing destination on the Cloudflare account. Unverified
 * addresses are rejected by the binding, so we fall through.
 */
const NOTIFY_CANDIDATES = [
  'alkyarchetype@gmail.com',
  'cody@seba.health',
  'cody@cityseamless.com',
];

const FROM_ADDRESS = 'orders@cody-peterson.com';

/** Verify a Stripe webhook signature (t=...,v1=... HMAC-SHA256). */
async function verifyStripeSignature(
  payload: string,
  header: string | null,
  secret: string,
): Promise<boolean> {
  if (!header) return false;

  let timestamp = '';
  const signatures: string[] = [];
  for (const part of header.split(',')) {
    const [k, v] = part.split('=', 2);
    if (k === 't') timestamp = v;
    if (k === 'v1') signatures.push(v);
  }
  if (!timestamp || signatures.length === 0) return false;

  // Reject events older than 5 minutes to blunt replay.
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${payload}`));
  const expected = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('');

  // Constant-time comparison.
  const expectedBytes = encoder.encode(expected);
  return signatures.some(sig => {
    const sigBytes = encoder.encode(sig);
    if (sigBytes.length !== expectedBytes.length) return false;
    let diff = 0;
    for (let i = 0; i < sigBytes.length; i++) diff |= sigBytes[i] ^ expectedBytes[i];
    return diff === 0;
  });
}

function formatAddress(shipping: Record<string, any> | undefined): string {
  if (!shipping) return '(no shipping address on session)';
  const a = shipping.address ?? {};
  return [
    shipping.name,
    a.line1,
    a.line2,
    [a.city, a.state, a.postal_code].filter(Boolean).join(', '),
    a.country,
  ].filter(Boolean).join('\n');
}

function buildRawEmail(from: string, to: string, subject: string, body: string): string {
  // Minimal RFC 5322 message; CRLF line endings throughout.
  const messageId = `<${crypto.randomUUID()}@cody-peterson.com>`;
  return [
    `From: Cody Peterson Orders <${from}>`,
    `To: <${to}>`,
    `Subject: ${subject}`,
    `Message-ID: ${messageId}`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    '',
    body,
  ].join('\r\n');
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as unknown as CFLocals).runtime?.env ?? {};
  const secret = (env.STRIPE_WEBHOOK_SECRET as string) ?? '';
  const mailer = env.ORDER_MAIL as SendEmailBinding | undefined;

  if (!secret) return new Response('webhook not configured', { status: 503 });

  const payload = await request.text();
  const valid = await verifyStripeSignature(payload, request.headers.get('stripe-signature'), secret);
  if (!valid) return new Response('invalid signature', { status: 400 });

  let event: any;
  try {
    event = JSON.parse(payload);
  } catch {
    return new Response('bad payload', { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ received: true, ignored: event.type }), { status: 200 });
  }

  const session = event.data?.object ?? {};
  if (session.metadata?.source !== 'cody_peterson_book') {
    // Donations and anything else on the shared Stripe account: acknowledge, do nothing.
    return new Response(JSON.stringify({ received: true, ignored: 'non-book source' }), { status: 200 });
  }

  const total = typeof session.amount_total === 'number'
    ? `$${(session.amount_total / 100).toFixed(2)}`
    : '(unknown total)';
  const format = session.metadata?.format ?? 'unknown format';
  const quantity = session.metadata?.quantity ?? '1';
  const customer = session.customer_details ?? {};
  // Field moved between Stripe API versions; accept either location.
  const shipping = session.collected_information?.shipping_details ?? session.shipping_details;
  const inscription = (session.custom_fields ?? [])
    .find((f: any) => f.key === 'inscription')?.text?.value ?? '';

  const subject = `Book order — ${format} ×${quantity} — ${total}`;
  const body = [
    'NEW BOOK ORDER — cody-peterson.com',
    '',
    `Format:    ${format}`,
    `Quantity:  ${quantity}`,
    `Total:     ${total} (includes shipping)`,
    '',
    'SHIP TO:',
    formatAddress(shipping),
    '',
    `Buyer email: ${customer.email ?? '(none)'}`,
    inscription ? `\nINSCRIPTION REQUEST:\n${inscription}` : '\nNo inscription requested.',
    '',
    `Stripe session: ${session.id ?? ''}`,
    'Payment details: https://dashboard.stripe.com/payments',
  ].join('\n');

  if (!mailer) {
    console.error('[stripe-webhook] ORDER_MAIL binding missing; order:', subject);
    return new Response('mailer not configured', { status: 500 });
  }

  const { EmailMessage } = await import('cloudflare:email');
  let sent = '';
  let lastErr = '';
  for (const to of NOTIFY_CANDIDATES) {
    try {
      const raw = buildRawEmail(FROM_ADDRESS, to, subject, body);
      await mailer.send(new EmailMessage(FROM_ADDRESS, to, raw));
      sent = to;
      break;
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
    }
  }

  if (!sent) {
    console.error('[stripe-webhook] all destinations rejected:', lastErr);
    // Non-2xx so Stripe retries; the order itself is safe in the dashboard.
    return new Response('notification failed', { status: 500 });
  }

  console.log(`[stripe-webhook] order notification sent to ${sent}: ${subject}`);
  return new Response(JSON.stringify({ received: true, notified: sent }), { status: 200 });
};
