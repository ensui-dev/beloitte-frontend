import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TosConfigCardProps {
  readonly tosText: string;
  readonly onTosTextChange: (text: string) => void;
}

export function TosConfigCard({
  tosText,
  onTosTextChange,
}: TosConfigCardProps): React.ReactElement {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base">Terms of Service</CardTitle>
        <CardDescription>
          Custom ToS text shown to customers during account creation. Leave empty to use the built-in default.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tos-text">ToS Content</Label>
          <Textarea
            id="tos-text"
            value={tosText}
            onChange={(e) => onTosTextChange(e.target.value)}
            placeholder="Leave empty to use the default Terms of Service..."
            rows={10}
            className="field-sizing-fixed resize-y border-white/[0.06] bg-white/[0.02] font-mono text-xs leading-relaxed"
          />
          <p className="text-xs text-muted-foreground">
            {tosText.length > 0
              ? `${tosText.length.toLocaleString()} characters`
              : "Using built-in default"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
