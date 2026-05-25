export const dynamic = 'force-dynamic';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; addon_success?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  const params = await searchParams;
  const isAddon = params.addon_success === 'true';

  return (
    <div style={{
      minHeight: '100vh', background: '#09090b',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 24, padding: 24, textAlign: 'center',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
      }}>✓</div>
      <div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 300, color: '#f2ede6', marginBottom: 12 }}>
          {isAddon ? 'Add-on activated.' : 'Welcome to MindReply.'}
        </h1>
        <p style={{ fontSize: 14, color: '#7a7068', maxWidth: 400, lineHeight: 1.7 }}>
          {isAddon
            ? 'Your add-on is now active. Head to your dashboard to see it in action.'
            : 'Your subscription is confirmed. Your operational hub is calibrated and waiting.'}
        </p>
      </div>
      <Link href="/dashboard" style={{
        padding: '12px 32px', borderRadius: 99, background: '#c9a96e', color: '#09090b',
        fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
        textDecoration: 'none',
      }}>
        Enter Your Hub →
      </Link>
    </div>
  );
}
