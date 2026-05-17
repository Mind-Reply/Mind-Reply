# MindReply

MindReply is a premium operational composure platform for agencies, founders, and high-performance individuals. It delivers precision-calibrated handling of messages, tasks, content, and digital workflow — framed around the concept of "invisible leverage" and signal clarity.

## Key Technologies

- **Next.js 15** (App Router, React 19)
- **Tailwind CSS 3** with CSS custom properties for theming
- **@anthropic-ai/sdk** via Netlify AI Gateway for the MR Advisor chat
- **Netlify** for hosting, functions, and AI Gateway

## Running Locally

```bash
npm install
npm run dev
```

The dev server starts on **port 4028**: http://localhost:4028

## Environment

The Netlify AI Gateway automatically injects `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` when deployed. For local development, create a `.env.local` file:

```
NEXT_PUBLIC_SITE_URL=http://localhost:4028
ANTHROPIC_API_KEY=your_key_here
```

## Domain

Live at: **https://mind-reply.com**
