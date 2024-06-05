// app/layout.tsx
import React from 'react';
import '../app/globals.css';
import SessionProviderWrapper from './SessionProviderWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>FlowerPress</title>
      </head>
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}