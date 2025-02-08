import { cn } from "@/lib/utils";

type Status = 'scheduled' | 'completed' | 'cancelled';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  scheduled: {
    label: 'Programado',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  completed: {
    label: 'Completado',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
} 