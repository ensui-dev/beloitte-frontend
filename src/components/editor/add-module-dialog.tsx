/**
 * AddModuleDialog — command palette for adding new modules.
 *
 * Lists all registered module types grouped by category.
 * Modules at maxInstances are shown as disabled.
 */
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { getAllModules } from "@/lib/config/module-registry";
import { resolveIcon } from "./editor-utils";
import type { ModuleType } from "@/lib/config/site-config-schema";

interface AddModuleDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSelect: (type: ModuleType) => void;
  readonly countByType: (type: ModuleType) => number;
}

/** Module categories for grouping in the picker. */
const MODULE_CATEGORIES: ReadonlyArray<{
  readonly label: string;
  readonly types: readonly ModuleType[];
}> = [
  {
    label: "Content",
    types: ["hero", "about", "cta", "dashboard-preview"],
  },
  {
    label: "Features",
    types: ["features", "pricing"],
  },
  {
    label: "Social",
    types: ["testimonials", "faq", "contact", "social-links"],
  },
  {
    label: "Media & Layout",
    types: ["image-carousel", "footer"],
  },
];

export function AddModuleDialog({
  open,
  onOpenChange,
  onSelect,
  countByType,
}: AddModuleDialogProps): React.ReactElement {
  const allModules = getAllModules();
  const moduleMap = new Map(allModules.map((m) => [m.type, m]));

  const handleSelect = (type: ModuleType): void => {
    onSelect(type);
    onOpenChange(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Module"
      description="Search for a module to add to your landing page"
    >
      <CommandInput placeholder="Search modules..." />
      <CommandList>
        <CommandEmpty>No modules found.</CommandEmpty>
        {MODULE_CATEGORIES.map((category) => (
          <CommandGroup key={category.label} heading={category.label}>
            {category.types.map((type) => {
              const reg = moduleMap.get(type);
              if (!reg) return null;

              const count = countByType(type);
              const atMax = count >= reg.maxInstances;
              const Icon = resolveIcon(reg.icon);

              return (
                <CommandItem
                  key={type}
                  value={`${reg.label} ${reg.description ?? ""}`}
                  onSelect={() => !atMax && handleSelect(type)}
                  disabled={atMax}
                  className="gap-3"
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm">{reg.label}</span>
                    {reg.description && (
                      <span className="text-xs text-muted-foreground">
                        {reg.description}
                      </span>
                    )}
                  </div>
                  {atMax && (
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      Max reached
                    </Badge>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
