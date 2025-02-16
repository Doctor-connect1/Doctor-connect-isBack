"use client"

import { AuthProvider } from '@/context/AuthContext';

export default function ConsultationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}