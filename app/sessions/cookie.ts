import { createCookie } from '@remix-run/node';

const cookie = createCookie(
  "__session",
  {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 3, // 1 week
    path: "/",
    sameSite: "lax",
    secure: true,
  }
);

export default cookie