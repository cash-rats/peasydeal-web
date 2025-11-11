# Emotion Hydration Stream Fix

## What went wrong (in plain English)
- React Router sends the browser a hidden stream of “to-do” instructions (loader data, navigation info, etc.) so that JavaScript can wake up and take over the already-rendered HTML.
- Our custom `app/entry.server.tsx` rendered the app twice to collect Emotion/MUI styles, but we removed that instruction stream before rendering. The browser never received the “to-do” list, so client-side JavaScript never ran.
- Result: even the simplest script on `app/routes/_index.tsx` sat there doing nothing because hydration had zero data to work with.

## What we changed to fix it
- We still render twice (needed for Emotion), but both renders now use a cloned context with the stream temporarily disabled. The real stream stays untouched.
- After the final render we manually read the stream and inject it back into the HTML as `<script>` tags, exactly like React Router normally would.
- Those scripts rebuild `window.__reactRouterContext` on the client, which lets `HydratedRouter` finish booting and enables JavaScript again.

## Takeaways
- Never delete or consume `entryContext.serverHandoffStream` without piping it back into the response—React Router relies on it for hydration.
- When customizing SSR for styling libraries (Emotion, MUI, etc.), always double-check that the handoff stream or script blob still reaches the browser.
