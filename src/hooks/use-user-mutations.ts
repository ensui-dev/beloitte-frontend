import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      dataService.suspendUser(userId, reason),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["users"] }); },
  });
}

export function useUnsuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => dataService.unsuspendUser(userId),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["users"] }); },
  });
}

export function useUpdateKyc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, kycVerified }: { userId: string; kycVerified: boolean }) =>
      dataService.updateUserKyc(userId, kycVerified),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["users"] }); },
  });
}

export function useAssignRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleName }: { userId: string; roleName: string }) =>
      dataService.assignUserRole(userId, roleName),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: ["users"] });
      void qc.invalidateQueries({ queryKey: ["userRoles", variables.userId] });
    },
  });
}

export function useRevokeRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, assignmentId }: { userId: string; assignmentId: number }) =>
      dataService.revokeUserRole(userId, assignmentId),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: ["users"] });
      void qc.invalidateQueries({ queryKey: ["userRoles", variables.userId] });
    },
  });
}
