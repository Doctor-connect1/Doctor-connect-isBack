"use client"

import Navbar from '@/components/Home/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  )
} 