import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh', background: '#09090b',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 32,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #c9a96e, #7c6b52)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Fraunces, serif', fontSize: 18, fontStyle: 'italic',
          color: '#09090b', margin: '0 auto 12px',
        }}>M</div>
        <p style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: '#f2ede6', fontWeight: 300 }}>
          MindReply
        </p>
        <p style={{ fontSize: 12, color: '#7a7068', marginTop: 4 }}>
          Enter your operational hub
        </p>
      </div>
      <SignIn
        appearance={{
          variables: {
            colorBackground: '#111115',
            colorText: '#f2ede6',
            colorPrimary: '#c9a96e',
            colorInputBackground: '#1a1a1f',
            colorInputText: '#f2ede6',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}
