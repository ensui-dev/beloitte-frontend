/**
 * Account type selection — two large cards for Personal vs Business.
 * Used as the first step in both onboarding and add-account flows.
 */
import { User, Building2 } from "lucide-react";
import type { AccountCategory } from "@/lib/data/types";

interface AccountTypeSelectorProps {
  readonly selected: AccountCategory | null;
  readonly onSelect: (type: AccountCategory) => void;
}

interface TypeOption {
  readonly type: AccountCategory;
  readonly label: string;
  readonly description: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

const TYPE_OPTIONS: readonly TypeOption[] = [
  {
    type: "personal",
    label: "Personal Account",
    description: "For managing your in-game finances. Track your balance, send transfers, and monitor spending.",
    icon: User,
  },
  {
    type: "business",
    label: "Business Account",
    description: "For your company or organization. Manage business finances, payroll, and capital separately.",
    icon: Building2,
  },
] as const;

export function AccountTypeSelector({
  selected,
  onSelect,
}: AccountTypeSelectorProps): React.ReactElement {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {TYPE_OPTIONS.map((option) => {
        const isSelected = selected === option.type;
        const Icon = option.icon;

        return (
          <button
            key={option.type}
            type="button"
            onClick={() => onSelect(option.type)}
            className={`group relative flex flex-col items-start gap-4 rounded-xl border p-6 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/[0.06] ring-1 ring-primary/30"
                : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
                isSelected
                  ? "bg-primary/15 text-primary"
                  : "bg-white/[0.04] text-muted-foreground group-hover:text-foreground"
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold">{option.label}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>

            {/* Selection indicator */}
            <div
              className={`absolute right-4 top-4 h-5 w-5 rounded-full border-2 transition-colors ${
                isSelected
                  ? "border-primary bg-primary"
                  : "border-white/[0.15] bg-transparent"
              }`}
            >
              {isSelected && (
                <svg className="h-full w-full text-primary-foreground" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
