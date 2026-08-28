# Production deployment

The application is a Next.js 15 Node.js deployment. Use Node.js 20 or newer.

## Required environment

Copy the variable names from `.env.example` into the deployment provider. Never upload `.env.local`.

- `NEXT_PUBLIC_SITE_URL`: the final HTTPS origin, without a trailing slash.
- `SMTP_USER`, `SMTP_PASS`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `CONTACT_EMAIL`, `LUCY_SMTP_FROM`: required for the contact channel and Lucy acknowledgement email.
- `GEMINI_API_KEY` or `OPENAI_API_KEY`: optional but recommended for Lucy's full generative intelligence and current web research. Gemini is preferred when both are present. Lucy remains available in built-in study, coding, writing, planning, portfolio and sourced-reference mode without either key.

## Release commands

```powershell
npm.cmd ci
npm.cmd run typecheck
npm.cmd run build
npm.cmd start
```

After launch, check `/api/health`. It reports service readiness without disclosing credentials. Then run `npm.cmd run check:smtp`, `npm.cmd run test:runtime`, and `npm.cmd run test:performance` from a machine with Microsoft Edge installed.

The app includes a sitemap, robots policy, web manifest, Open Graph image, canonical metadata, secure browser headers, API rate limiting, custom 404/error recovery, responsive low-performance mode and provider failover for Lucy.
