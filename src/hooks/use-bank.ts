import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";

export function useBank() {
  return useQuery({
    queryKey: ["bank"],
    queryFn: () => dataService.getBank(),
  });
}
