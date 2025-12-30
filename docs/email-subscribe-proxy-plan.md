# Email Subscribe Proxy Plan (`/api/email-subscribe`)

## Goal

When a user submits a valid email in the newsletter subscribe UI, the app should:

1. Submit a `POST` to an internal proxy route: `/api/email-subscribe`
2. The proxy action forwards the request to the backend API: `POST /v2/subscribe`
3. On success, `SubscribeModal` is displayed
4. On failure, the UI shows an error message and does not open the success modal

## Why a Proxy Route

- Keeps the backend API base URL (`envs.PEASY_DEAL_ENDPOINT`) server-only
- Leverages existing `root.tsx` behavior: `shouldRevalidate()` skips reloads for `formAction` starting with `/api/`
- Matches existing route naming patterns (e.g. `api.cart.checkout` → `/api/cart/checkout`)

## Proposed Route

- New route module: `app/routes/api.email-subscribe/route.tsx`
- URL: `POST /api/email-subscribe`

### Action Responsibilities

- Parse `email` from `request.formData()`
- Validate `email` (minimum: required + basic email validation)
- Forward to backend:
  - `POST ${envs.PEASY_DEAL_ENDPOINT}/v2/subscribe`
  - Include `email` in the request payload (confirm exact content-type and shape)
- Return a normalized JSON response

## Normalized Response Contract (Proxy → Client)

The proxy action should always return one of:

### Success

```json
{ "ok": true }
```

### Error

```json
{ "ok": false, "error": "Human readable message", "code": "optional_backend_code" }
```

Notes:

- Client code should key off `ok` only.
- The `error` string should be safe to display directly in the UI.

## Client Changes

### Update Fetcher Targets

Update all subscribe forms that currently post to `'/subscribe?index'` to post to:

- `action='/api/email-subscribe'`

Known references:

- `app/components/Footer/components/EmailSubscribe/index.tsx`
- `app/components/PromoteSubscriptionModal/index.tsx`
- `__index/mail/subscribe.tsx` and `__index/events/win-a-free-surprise-gift.tsx` (if still in use)

### Align `useEmailSubscribe`

`app/hooks/useEmailSubscribe.tsx` should:

- Treat `{ ok: true }` as success → `openModal = true`, clear errors
- Treat `{ ok: false }` as failure → set error state, do not open success modal

## Backend Contract Checklist

Confirm for `POST /v2/subscribe`:

- Payload type: `application/json` vs `application/x-www-form-urlencoded`
- Body keys: `{ email }` (and any optional keys like campaign/source)
- Response shape on success
- Response shape on validation errors (email invalid / already subscribed)
- Status codes used

## Testing Plan (Vitest)

Add a small unit test suite for `app/routes/api.email-subscribe/route.tsx`:

- Missing email → `400` with `{ ok:false }`
- Invalid email → `400` with `{ ok:false }`
- Backend `200` → `{ ok:true }`
- Backend non-`200` → `{ ok:false }` with mapped `error`

Mock `global.fetch` and construct a `Request` with `FormData` to call the action.

## Acceptance Criteria

- Submitting a valid email triggers exactly one request to `/api/email-subscribe`
- The proxy sends a `POST` to `${envs.PEASY_DEAL_ENDPOINT}/v2/subscribe` with the email payload
- Success opens `SubscribeModal`
- Failure shows an inline error and keeps the modal closed
- No full-page reload occurs (fetcher-based submission)

