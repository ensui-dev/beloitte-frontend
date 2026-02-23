import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";

export function useVolumeHistory(days = 30) {
  return useQuery({
    queryKey: ["volumeHistory", days],
    queryFn: () => dataService.getVolumeHistory(days),
  });
}
