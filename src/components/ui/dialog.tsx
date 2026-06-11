import { createPortal } from "react-dom"
import { X } from "lucide-react"
import type * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-black/45 p-4">
      <button className="absolute inset-0 cursor-default" aria-label="Close dialog" onClick={() => onOpenChange(false)} />
      {children}
    </div>,
    document.body,
  )
}

function DialogContent({
  className,
  children,
  onClose,
}: React.ComponentProps<"div"> & { onClose?: () => void }) {
  return (
    <div
      className={cn(
        "relative z-10 w-full max-w-lg rounded-xl border bg-background p-6 text-foreground shadow-xl",
        className,
      )}
      role="dialog"
      aria-modal="true"
    >
      {onClose ? (
        <Button className="absolute right-3 top-3" size="icon-sm" variant="ghost" onClick={onClose} aria-label="Close">
          <X className="size-4" />
        </Button>
      ) : null}
      {children}
    </div>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1.5 pr-8", className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
}

export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle }
