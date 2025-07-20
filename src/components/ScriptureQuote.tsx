import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ScriptureQuoteProps {
  verse: string;
  reference: string;
  theme?: "default" | "business" | "stewardship" | "community" | "service" | "growth" | "faith" | "giving";
}

export const ScriptureQuote = ({ verse, reference, theme = "default" }: ScriptureQuoteProps) => {
  const getThemeStyles = () => {
    switch (theme) {
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
      default:
        return "border-l-4 border-l-primary bg-primary/5";
    }
  };

  return (
    <Card className={`p-6 ${getThemeStyles()}`}>
      <div className="flex items-start space-x-4">
        <Quote className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
        <div className="space-y-3">
          <blockquote className="text-lg italic leading-relaxed text-foreground">
            "{verse}"
          </blockquote>
          <cite className="text-sm font-semibold text-muted-foreground">
            — {reference}
          </cite>
        </div>
      </div>
    </Card>
  );
};