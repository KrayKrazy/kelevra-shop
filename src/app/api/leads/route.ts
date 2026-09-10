import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import crypto from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const FB_PIXEL_ID = '1828719384743126';
const FB_ACCESS_TOKEN = process.env.FB_CAPI_TOKEN; // Add to your .env

// Helper: SHA-256 hash for PII data (required by Meta CAPI)
function hashData(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

async function sendMetaLeadEvent(phone: string, clientIp: string, userAgent: string, eventId: string) {
  if (!FB_ACCESS_TOKEN) {
    console.warn('[CAPI] FB_CAPI_TOKEN not set — skipping Meta CAPI event.');
    return;
  }

  // Format phone: remove non-digits, prefix with 55 (Brazil) if missing
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const payload = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId, // Deduplication ID (matches client-side fbq event_id if fired)
        event_source_url: 'https://forms.kelevra.shop',
        action_source: 'website',
        user_data: {
          ph: [hashData(formattedPhone)], // Hashed phone
          client_ip_address: clientIp,
          client_user_agent: userAgent,
        },
      },
    ],
    // test_event_code: 'TEST12345', // ← Uncomment to test in Meta Events Manager
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    const result = await res.json();
    if (!res.ok) {
      console.error('[CAPI] Meta API error:', result);
    } else {
      console.log('[CAPI] Lead event sent successfully. Events received:', result.events_received);
    }
  } catch (err) {
    console.error('[CAPI] Failed to send event to Meta:', err);
  }
}

export async function POST(req: Request) {
  try {
    const { name, phone, business } = await req.json();

    if (!name || !phone || !business) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios' }, { status: 400 });
    }

    // Save lead to database
    const client = await pool.connect();
    try {
      const query = "INSERT INTO leads (name, phone, business) VALUES ($1, $2, $3) RETURNING id;";
      const values = [name, phone, business];
      await client.query(query, values);
    } finally {
      client.release();
    }

    // Fire Meta CAPI Lead event (server-side, never blocked by iOS/ad blockers)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip') ?? '';
    const userAgent = req.headers.get('user-agent') ?? '';
    const eventId = `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // Fire and forget — don't block the response waiting for Meta
    sendMetaLeadEvent(phone, clientIp, userAgent, eventId);

    return NextResponse.json({ success: true, eventId });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
