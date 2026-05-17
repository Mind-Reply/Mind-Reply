export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, company } = body;

    if (!name || !email || !message) {
      return Response.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Log contact for now; integrate email service as needed
    console.log('Contact submission:', { name, email, company, messageLength: message.length });

    return Response.json({
      success: true,
      message: 'Received. You will hear from us within one business day.',
    });
  } catch (err) {
    console.error('Contact error:', err);
    return Response.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
