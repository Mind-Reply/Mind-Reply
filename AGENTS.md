# AGENTS.md — MindReply Architecture

## Project Overview

MindReply is a Next.js 15 marketing + product site for a business operations platform. The design language is dark premium (near-black, warm amber/gold accents), with editorial typography (Fraunces serif + DM Sans).

## Directory Structure

```
src/
  app/
    layout.tsx          — Root layout: fonts, metadata, global CSS import
    page.tsx            — Homepage: assembles all sections, JSON-LD schemas
    not-found.tsx       — 404 page
    robots.ts           — SEO robots
    sitemap.ts          — XML sitemap
    api/
      chat/route.ts     — MR Advisor chat endpoint (Anthropic via AI Gateway)
      contact/route.ts  — Contact form handler
    components/         — Page-specific sections (used only in page.tsx)
      HeroSection.tsx   — Hero with live operations feed, CTA configurator
      FeaturesSection.tsx — Bento grid of 5 capabilities
      ToolsSection.tsx  — Bandwidth Audit + Signal Clarity Check interactive tools
      ServicesSection.tsx — Horizontal scroll service cards (Unsplash images)
      ChatSection.tsx   — MR Advisor chat interface
      AboutSection.tsx  — Philosophy, testimonial, stats bar
      PricingSection.tsx — 3-tier pricing (Signal free, Growth, Pro), FAQs
  components/           — Shared components
    Header.tsx          — Sticky nav with scroll effect + mobile menu
    Footer.tsx          — Brand, navigation, legal, CTA
  styles/
    tailwind.css        — Tailwind + CSS variables + custom component styles

public/
  assets/images/        — Local images (hero-atmosphere.png, app_logo.png)
  favicon.ico
```

## Design System

CSS custom properties on `:root`:
- `--background`: #09090b (near black)
- `--card`: #111115 (dark card)
- `--primary`: #c9a96e (warm gold)
- `--foreground`: #f2ede6 (warm white)
- `--muted-foreground`: #7a7068

All styling is inline styles + Tailwind utilities. No CSS Modules. The `card-glow` and `reveal` utility classes are in `tailwind.css`.

## Key Conventions

- All section components are `'use client'` where they have interactivity
- Images use `<img>` tags directly (not `next/image`) for simplicity; alt text is descriptive and SEO-conscious
- Structured data (JSON-LD) is injected in `page.tsx`
- The MR Advisor chat calls `/api/chat` → `src/app/api/chat/route.ts` → Anthropic claude-haiku-4-5
- No `rocket.new` image URLs — all replaced with Unsplash or local assets

## Non-Obvious Decisions

- Inline styles preferred over Tailwind for complex responsive layouts to avoid needing arbitrary value classes
- `reveal` class uses IntersectionObserver for scroll-triggered animations
- `live-dot` class in CSS produces the pulsing amber indicator used throughout
- The Bandwidth Audit uses a 72% reclaim rate as a conservative illustrative benchmark
