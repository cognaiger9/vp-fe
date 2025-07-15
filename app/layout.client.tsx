"use client"

import { AuthProvider } from '@/components/auth-provider'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
} 