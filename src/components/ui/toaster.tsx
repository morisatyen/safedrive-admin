import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport, ToastIcon, ToastProgressBar } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, duration, ...props }) {
        return (
          <Toast key={id} variant={variant} duration={duration} {...props}>
            <ToastIcon variant={variant} />
            <div className="flex-1 space-y-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
            <ToastProgressBar variant={variant} duration={duration} />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
