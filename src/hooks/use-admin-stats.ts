import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";

export function useAdminStats() {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: () => dataService.getAdminStats(),
  });
}
