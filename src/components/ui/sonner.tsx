"use client"

import { cn } from "cn"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useResolvedTheme } from "@/components/ThemeToggle"

const Toaster = ({
  className,
  containerAriaLabel = "Notificações",
  toastOptions,
  ...props
}: ToasterProps) => {
  const resolvedTheme = useResolvedTheme()

  return (
    <Sonner
      theme={resolvedTheme}
      className={cn("toaster group no-print", className)}
      containerAriaLabel={containerAriaLabel}
      toastOptions={{
        ...toastOptions,
        closeButtonAriaLabel:
          toastOptions?.closeButtonAriaLabel ?? "Fechar notificação",
      }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 motion-safe:animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
