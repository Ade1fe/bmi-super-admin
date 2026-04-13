## BMI Super Admin

This repo now contains a fresh [Next.js](https://nextjs.org) app with:

- App Router
- TypeScript
- Tailwind CSS
- `lucide-react` for icons

## Run locally

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Main files:

- `src/app/page.tsx`: landing page and icon examples
- `src/app/globals.css`: theme tokens and global styling
- `src/app/layout.tsx`: app metadata and root layout

## Icon choice

This starter uses `lucide-react` because it is:

- lightweight
- visually consistent
- easy to use with Tailwind utility classes

Useful icon picks for admin apps:

- `LayoutDashboard` for overview pages
- `Users` for people and roles
- `BarChart3` for reports and analytics
- `ShieldCheck` for security or approvals
- `BellRing` for notifications

Browse the full set at [lucide.dev/icons](https://lucide.dev/icons/).

## Verify

```bash
npm run lint
npm run build
```
