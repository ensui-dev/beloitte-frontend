import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useSiteConfig } from "@/hooks/use-site-config";
import { ProfilePopover } from "./profile-popover";

export function DashboardTopbar(): React.ReactElement {
  const { data: config } = useSiteConfig();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-white/[0.06] bg-background/60 px-4 backdrop-blur-xl backdrop-saturate-150">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="mr-1 h-5 bg-white/[0.06]" />

      <div className="flex-1">
        <span className="text-sm font-medium">{config?.bankName ?? "Dashboard"}</span>
      </div>

      <ProfilePopover />
    </header>
  );
}
