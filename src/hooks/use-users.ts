import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";

export function useUsers(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: () => dataService.getUsers(page, pageSize),
  });
}

export function useUserRoles(userId: string | null) {
  return useQuery({
    queryKey: ["userRoles", userId],
    queryFn: () => dataService.getUserRoles(userId!),
    enabled: userId !== null,
  });
}
