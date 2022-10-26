import type { ReactNode } from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <CssBaseline />
        {children}
      </Box>
    </Container>
  );
}
