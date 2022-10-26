import type { ReactNode } from 'react';
import CssBaseline from "@mui/material/CssBaseline";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
}
