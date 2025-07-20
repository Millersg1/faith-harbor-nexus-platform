import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getRandomScripture, getDailyScripture, Scripture } from "@/lib/scriptures";

interface DynamicScriptureQuoteProps {
  theme?: Scripture['theme'];
  variant?: "random" | "daily";
  className?: string;
}

export const DynamicScriptureQuote = ({ 
  theme, 
  variant = "random",
  className = "" 
}: DynamicScriptureQuoteProps) => {
  const [scripture, setScripture] = useState<Scripture | null>(null);

  useEffect(() => {
    const selectedScripture = variant === "daily" 
      ? getDailyScripture(theme)
      : getRandomScripture(theme);
    
    setScripture(selectedScripture);
  }, [theme, variant]);

  if (!scripture) return null;

  const getThemeStyles = () => {
    switch (scripture.theme) {
      case "business":
        return "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/30";
      case "stewardship":
        return "border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/30";
      case "community":
        return "border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/30";
      case "service":
        return "border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/30";
      case "growth":
        return "border-l-4 border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/30";
      case "faith":
        return "border-l-4 border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30";
      case "giving":
        return "border-l-4 border-l-rose-500 bg-rose-50/50 dark:bg-rose-950/30";
      case "leadership":
        return "border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/30";
      case "wisdom":
        return "border-l-4 border-l-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30";
      case "peace":
        return "border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30";
      case "strength":
        return "border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/30";
      default:
        return "border-l-4 border-l-primary bg-primary/5";
    }
  };

  return (
    <Card className={`p-6 ${getThemeStyles()} ${className}`}>
      <div className="flex items-start space-x-4">
        <Quote className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
        <div className="space-y-3">
          <blockquote className="text-lg italic leading-relaxed text-foreground">
            "{scripture.verse}"
          </blockquote>
          <cite className="text-sm font-semibold text-muted-foreground">
            — {scripture.reference}
          </cite>
          {variant === "daily" && (
            <p className="text-xs text-muted-foreground opacity-75">
              Today's Scripture
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};