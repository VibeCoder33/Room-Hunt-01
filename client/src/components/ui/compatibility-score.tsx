import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CompatibilityScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
}

export function CompatibilityScore({ score, size = "md", showProgress = false }: CompatibilityScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "text-green-700";
    if (score >= 60) return "text-yellow-700";
    return "text-red-700";
  };

  const sizeClasses = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-2",
    lg: "text-lg px-4 py-3"
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`${sizeClasses[size]} bg-secondary/10 rounded-lg text-center`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Compatibility</span>
          <span className={`text-lg font-bold ${getScoreText(score)}`}>{score}%</span>
        </div>
        {showProgress && (
          <Progress value={score} className="mt-2 h-2" />
        )}
      </div>
    </div>
  );
}

interface CompatibilityBadgeProps {
  score: number;
}

export function CompatibilityBadge({ score }: CompatibilityBadgeProps) {
  const getVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <Badge variant={getVariant(score)} className="font-semibold">
      {score}% Match
    </Badge>
  );
}
