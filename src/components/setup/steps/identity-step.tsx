/**
 * Identity step — bank name and slug configuration.
 *
 * The slug auto-derives from the name via a simple slugify function
 * but remains editable if the admin wants to override.
 * The bank ID is shown as read-only since it's assigned by the deployment.
 */
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark } from "lucide-react";
import type { SetupIdentity } from "../bank-setup-wizard";

interface IdentityStepProps {
  readonly value: SetupIdentity;
  readonly bankId: string;
  readonly onChange: (value: SetupIdentity) => void;
}

/** Convert a bank name to a URL-safe slug. */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function IdentityStep({
  value,
  bankId,
  onChange,
}: IdentityStepProps): React.ReactElement {
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const bankName = e.target.value;
      onChange({
        bankName,
        bankSlug: slugify(bankName),
      });
    },
    [onChange]
  );

  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      // Allow manual override — only permit URL-safe chars
      const raw = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
      onChange({ ...value, bankSlug: raw });
    },
    [onChange, value]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.62_0.20_255_/_0.1)]">
          <Landmark className="h-5 w-5 text-[oklch(0.62_0.20_255)]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Bank Identity</h2>
          <p className="text-sm text-[oklch(0.65_0.03_255)]">
            Choose the name that will appear across your banking platform.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Bank Name */}
        <div className="space-y-2">
          <Label htmlFor="bank-name">Bank Name</Label>
          <Input
            id="bank-name"
            value={value.bankName}
            onChange={handleNameChange}
            placeholder="e.g. Reveille National Bank"
            className="border-white/[0.08] bg-white/[0.04]"
            autoFocus
          />
          <p className="text-xs text-[oklch(0.65_0.03_255)]">
            This appears in the header, footer, and landing page.
          </p>
        </div>

        {/* Bank Slug */}
        <div className="space-y-2">
          <Label htmlFor="bank-slug">URL Slug</Label>
          <Input
            id="bank-slug"
            value={value.bankSlug}
            onChange={handleSlugChange}
            placeholder="e.g. reveille"
            className="border-white/[0.08] bg-white/[0.04]"
          />
          <p className="text-xs text-[oklch(0.65_0.03_255)]">
            Used in URLs and identifiers. Auto-generated from the name.
          </p>
        </div>

        {/* Bank ID (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="bank-id" className="text-[oklch(0.65_0.03_255)]">
            Bank ID
          </Label>
          <Input
            id="bank-id"
            value={bankId}
            readOnly
            disabled
            className="border-white/[0.04] bg-white/[0.02] text-[oklch(0.65_0.03_255)]"
          />
          <p className="text-xs text-[oklch(0.65_0.03_255_/_0.6)]">
            Assigned by the deployment. Cannot be changed.
          </p>
        </div>
      </div>
    </div>
  );
}
