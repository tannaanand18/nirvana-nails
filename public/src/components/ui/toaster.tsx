import { useEffect, useState } from "react"

export function Toaster() {
  const [toasts, setToasts] = useState<any[]>([])

  // This is a simplified toaster - can be extended as needed
  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="mb-2 flex items-center justify-between rounded-lg border border-border bg-background p-4 text-foreground shadow-lg"
        >
          <div>
            <p className="font-semibold">{toast.title}</p>
            {toast.description && (
              <p className="text-sm text-muted-foreground">{toast.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
