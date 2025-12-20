import { computed } from "vue";
import { useAuthStore } from "../stores/auth-store";

/**
 * Composable for checking user permissions
 * @param resource - The resource name (e.g., 'user', 'role', 'post')
 * @returns Object with computed properties for each permission type
 *
 * @example
 * ```ts
 * const { canCreate, canEdit, canDelete, canView } = usePermissions('user');
 * // Checks: user.create, user.edit, user.delete, user.view
 * ```
 */
export function usePermissions(resource: string) {
  const authStore = useAuthStore();

  const canCreate = computed(() => {
    return authStore.permissions.includes(`${resource}.create`);
  });

  const canEdit = computed(() => {
    return authStore.permissions.includes(`${resource}.edit`);
  });

  const canDelete = computed(() => {
    return authStore.permissions.includes(`${resource}.delete`);
  });

  const canView = computed(() => {
    return authStore.permissions.includes(`${resource}.view`);
  });

  const canShow = computed(() => {
    return authStore.permissions.includes(`${resource}.show`);
  });

  const hasPermission = (permission: string) => {
    return authStore.permissions.includes(permission);
  };

  return {
    canCreate,
    canEdit,
    canDelete,
    canView,
    canShow,
    hasPermission,
  };
}
