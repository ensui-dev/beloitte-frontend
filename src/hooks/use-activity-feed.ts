import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";

export function useActivityFeed(limit = 10) {
  return useQuery({
    queryKey: ["activityFeed", limit],
    queryFn: () => dataService.getActivityFeed(limit),
  });
}
