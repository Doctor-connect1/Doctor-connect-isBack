"use client"



export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
     
      <main>
        {children}
      </main>
    </div>
  )
}
