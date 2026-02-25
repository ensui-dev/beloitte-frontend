/**
 * Account details form — collects nickname based on account category.
 *
 * Personal:  Nickname (In-Game Name)
 * Business:  Nickname (Business Entity Name)
 *
 * This form no longer creates the account directly — it validates and
 * reports the nickname via onSubmit. Account creation happens after ToS
 * acceptance in the wizard flow.
 */
import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { AccountCategory } from "@/lib/data/types";

// ─── Validation Schemas ─────────────────────────────────────

const personalSchema = z.object({
  nickname: z.string().min(1, "In-game name is required").max(32, "Name must be 32 characters or less"),
});

const businessSchema = z.object({
  nickname: z.string().min(1, "Business entity name is required").max(64, "Name must be 64 characters or less"),
});

interface FormErrors {
  nickname?: string;
}

interface AccountDetailsFormProps {
  readonly accountType: AccountCategory;
  /** Called with the validated nickname when the user clicks Next. */
  readonly onSubmit: (nickname: string) => void;
  readonly onBack: () => void;
  /** Pre-fill nickname if returning to this step. */
  readonly initialNickname?: string;
}

export function AccountDetailsForm({
  accountType,
  onSubmit,
  onBack,
  initialNickname = "",
}: AccountDetailsFormProps): React.ReactElement {
  const [nickname, setNickname] = useState(initialNickname);
  const [errors, setErrors] = useState<FormErrors>({});

  const isPersonal = accountType === "personal";

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setErrors({});

    const schema = isPersonal ? personalSchema : businessSchema;
    const parsed = schema.safeParse({ nickname });

    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    onSubmit(parsed.data.nickname);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Account nickname */}
      <div className="space-y-2">
        <Label htmlFor="account-name">
          {isPersonal ? "In-Game Name" : "Business Entity Name"}
        </Label>
        <Input
          id="account-name"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={isPersonal ? "Your Minecraft username" : "e.g. MarbleCorp Industries"}
          className="border-white/[0.06] bg-white/[0.02]"
          autoFocus
        />
        {errors.nickname && (
          <p className="text-xs text-destructive">{errors.nickname}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-white/[0.06]"
        >
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Next
        </Button>
      </div>
    </form>
  );
}
