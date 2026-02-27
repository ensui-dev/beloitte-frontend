/**
 * Role access utilities.
 *
 * Centralizes the logic for determining which roles a user can access.
 * Superadmins (cross-tenant flag) can switch to ANY role regardless of
 * their per-bank role assignments — this is the bootstrap mechanism.
 */

import { USER_ROLES, type UserRole } from "@/lib/data/types";

/**
 * Get the set of roles a user can switch to.
 * Superadmins get ALL roles; regular users get their assigned roles only.
 */
export function getEffectiveRoles(
  assignedRoles: readonly UserRole[],
  isSuperadmin: boolean
): readonly UserRole[] {
  if (isSuperadmin) return USER_ROLES;
  return assignedRoles;
}

/**
 * Check if a user can access a specific role.
 */
export function canAccessRole(
  role: UserRole,
  assignedRoles: readonly UserRole[],
  isSuperadmin: boolean
): boolean {
  return isSuperadmin || assignedRoles.includes(role);
}
