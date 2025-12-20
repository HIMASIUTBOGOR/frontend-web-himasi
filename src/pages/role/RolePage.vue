<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import {
  useModal,
  useToast,
  VaCard,
  VaCardContent,
  VaIcon,
  VaInput,
} from "vuestic-ui";
import { Role } from "./type";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "../../services/user.service";
import { usePermissions } from "../../composables/usePermissions";
import { payloadRole } from "../../interfaces/IUser";
import RoleTable from "./widgets/RoleTable.vue";
import FormRole from "./widgets/FormRole.vue";

const doShowEditRoleModal = ref(false);
const { init: notify } = useToast();

// State
const allRoles = ref<Role[]>([]);
const isLoading = ref(false);
const filters = ref({ isActive: true, search: "" });
const sorting = ref<{ sortBy: any; sortingOrder: any }>({
  sortBy: undefined,
  sortingOrder: null,
});
const pagination = ref({ page: 1, perPage: 10, total: 0 });

// Fetch role from API
const fetchRole = async () => {
  try {
    isLoading.value = true;
    const response = await getRoles({
      limit: pagination.value.perPage,
      page: pagination.value.page,
      search: filters.value.search,
    });
    allRoles.value = response.roles;
    pagination.value.total = response.meta.total;
  } catch (error: any) {
    notify({
      message: error.message || "Failed to fetch roles",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

const roles = computed(() => {
  return allRoles.value;
});

// Load roles on mount
onMounted(() => {
  fetchRole();
});

// Watch search filter and refetch
watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1; // Reset to first page on search
    fetchRole();
  }
);

// Watch pagination changes
watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => {
    fetchRole();
  }
);

const roleToEdit = ref<Role | null>(null);

const showEditRoleModal = (role: Role) => {
  roleToEdit.value = role;
  doShowEditRoleModal.value = true;
};

const showAddRoleModal = () => {
  roleToEdit.value = null;
  doShowEditRoleModal.value = true;
};

const onRoleSaved = async (roleData: payloadRole) => {
  try {
    if (roleToEdit.value) {
      // Update existing role
      await updateRole(roleToEdit.value.id, roleData);
      notify({
        message: `${roleData.name} has been updated`,
        color: "success",
      });
    } else {
      // Create new role
      await createRole(roleData);
      notify({
        message: `${roleData.name} has been created`,
        color: "success",
      });
    }

    doShowEditRoleModal.value = false;
    await fetchRole();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to save role",
      color: "danger",
    });
  }
};

const onRoleDelete = async (role: Role) => {
  try {
    await deleteRole(role.id);
    notify({
      message: `${role.name} has been deleted`,
      color: "success",
    });
    await fetchRole();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to delete role",
      color: "danger",
    });
  }
};

const editFormRef = ref();
const { confirm } = useModal();

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value?.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: "380px",
      message: "Form has unsaved changes. Are you sure you want to close it?",
      size: "small",
    });
    if (agreed) {
      hide();
    }
  } else {
    hide();
  }
};

// Check user permissions using reusable composable
const {
  canCreate: canCreateRole,
  canEdit: canEditRole,
  canDelete: canDeleteRole,
  canView: canViewRole,
} = usePermissions("role");
</script>

<template>
  <h1 class="page-title">Role Page</h1>

  <VaCard>
    <VaCardContent>
      <div v-if="!canViewRole" class="flex items-center justify-center py-8">
        <VaAlert color="warning" border="top">
          You don't have permission to view this page.
        </VaAlert>
      </div>

      <template v-else>
        <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
          <div class="flex flex-col md:flex-row gap-2 justify-start">
            <VaInput
              v-model="filters.search"
              placeholder="Search role..."
              class="w-full md:w-64"
            >
              <template #prependInner>
                <VaIcon name="search" color="secondary" size="small" />
              </template>
            </VaInput>
          </div>
          <VaButton v-if="canCreateRole" @click="showAddRoleModal">
            Add Role
          </VaButton>
        </div>

        <RoleTable
          :role="roles"
          :loading="isLoading"
          :pagination="pagination"
          :can-edit="canEditRole"
          :can-delete="canDeleteRole"
          v-model:sortBy="sorting.sortBy"
          v-model:sortingOrder="sorting.sortingOrder"
          @edit-role="showEditRoleModal"
          @delete-role="onRoleDelete"
        />
      </template>
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditRoleModal"
    size="large"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ roleToEdit ? "Edit Role" : "Add Role" }}</h1>
    <FormRole
      ref="editFormRef"
      :role="roleToEdit"
      :save-button-label="roleToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (role) => {
          onRoleSaved(role);
          ok();
        }
      "
    />
  </VaModal>
</template>
