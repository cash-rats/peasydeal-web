import { createCookie } from '@remix-run/node';
import invariant from 'tiny-invariant';

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const cookie = createCookie(
  "__session",
  {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 3, // 1 week
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  }
);

export default cookie