# GALORTINC OTP Numbers — starter project

A responsive React + TypeScript dashboard starter with:
- Overview, verification request list, wallet placeholder, settings
- Dedicated API integration screen
- Supabase client setup and starter SQL schema
- Supabase Edge Function placeholder for a server-side provider adapter
- NGN (₦) display defaults

## Important scope

This starter is for verification messages in services your business owns or is authorized to operate, with recipient consent. It is not a temporary-number resale marketplace and does not implement verification for unrelated third-party accounts or security bypasses.

The provider integration is intentionally disabled. Confirm your provider's commercial terms and allowed use cases before connecting it. Never guess API endpoints.

## Run locally

1. Install Node.js (LTS).
2. Extract this ZIP and open the folder in a terminal.
3. Run `npm install`.
4. Copy `.env.example` to `.env` and add your Supabase project URL and public anon key.
5. Run `npm run dev`.
6. Open the local URL printed by Vite.

You can preview the UI without Supabase; it will show Demo mode.

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`.
4. Configure provider secrets only in Supabase Edge Function secrets, never in frontend `.env`:
   `supabase secrets set SMS_PROVIDER_API_KEY=...`
5. Deploy the Edge Function only after implementing and testing the approved provider adapter.

## API integration screen

The screen provides fields for provider type, base URL, and environment. The save button currently saves a draft only in the browser session; it does not contact a provider. Secret keys are deliberately not collected in the UI.

## Before production

- Add Supabase Auth screens and server-validated sessions.
- Add authorization checks, recipient consent capture, rate limits, audit logging, and retention rules.
- Implement the official provider API inside the Edge Function.
- Configure CORS to your exact production domain.
- Add automated tests and review RLS policies.
- If adding payments, use a supported payment provider and verify every payment server-side before crediting a wallet. Prevent duplicate webhook processing.
