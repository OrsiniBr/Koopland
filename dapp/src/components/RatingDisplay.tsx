import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  label: string;
  value: number;
  max?: number;
  showProgress?: boolean;
  className?: string;
}

export function RatingDisplay({
  label,
  value,
  max = 10,
  showProgress = true,
  className,
}: RatingDisplayProps) {
  const percentage = (value / max) * 100;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-foreground font-semibold">
          {value.toFixed(1)}/{max}
        </span>
      </div>
      {showProgress && (
        <div className="w-full h-2 bg-lightgray rounded-full overflow-hidden">
          <div
            className="h-full bg-tan transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
