<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useModal, useToast } from "vuestic-ui";
import {
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
} from "../../services/user.service";
import { Permission } from "./type";
import PermissionTable from "./widgets/PermissionTable.vue";
import AddPermissionForm from "./widgets/AddPermissionForm.vue";
import { usePermissions } from "../../composables/usePermissions";

const doShowEditPermissionModal = ref(false);
const { init: notify } = useToast();

// State
const allPermissions = ref<Permission[]>([]);
const isLoading = ref(false);
const filters = ref({ isActive: true, search: "" });
const sorting = ref<{ sortBy: any; sortingOrder: any }>({
  sortBy: undefined,
  sortingOrder: null,
});
const pagination = ref({ page: 1, perPage: 10, total: 0 });

// Fetch permissions from API
const fetchPermissions = async () => {
  try {
    isLoading.value = true;
    const response = await getPermission({
      limit: pagination.value.perPage,
      page: pagination.value.page,
      search: filters.value.search,
    });
    allPermissions.value = response.permissions;
    pagination.value.total = response.meta.total;
  } catch (error: any) {
    notify({
      message: error.message || "Failed to fetch permissions",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

// Return permissions directly from API (no client-side filtering)
const permissions = computed(() => {
  return allPermissions.value;
});

// Load permissions on mount
onMounted(() => {
  fetchPermissions();
});

// Watch search filter and refetch
watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1; // Reset to first page on search
    fetchPermissions();
  }
);

// Watch pagination changes
watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => {
    fetchPermissions();
  }
);

const permissionToEdit = ref<Permission | null>(null);

const showEditPermissionModal = (permission: Permission) => {
  permissionToEdit.value = permission;
  doShowEditPermissionModal.value = true;
};

const showAddPermissionModal = () => {
  permissionToEdit.value = null;
  doShowEditPermissionModal.value = true;
};

const onPermissionSaved = async (permissionData: {
  name: string;
  guard_name: string;
}) => {
  try {
    if (permissionToEdit.value) {
      // Update existing permission
      await updatePermission(permissionToEdit.value.id, permissionData);
      notify({
        message: `${permissionData.name} has been updated`,
        color: "success",
      });
    } else {
      // Create new permission
      await createPermission(permissionData);
      notify({
        message: `${permissionData.name} has been created`,
        color: "success",
      });
    }

    doShowEditPermissionModal.value = false;
    await fetchPermissions();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to save permission",
      color: "danger",
    });
  }
};

const onPermissionDelete = async (permission: Permission) => {
  try {
    await deletePermission(permission.id);
    notify({
      message: `${permission.name} has been deleted`,
      color: "success",
    });
    await fetchPermissions();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to delete permission",
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
  canCreate: canCreatePermission,
  canEdit: canEditPermission,
  canDelete: canDeletePermission,
} = usePermissions("permission");
</script>

<template>
  <h1 class="page-title">Permission Page</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput
            v-model="filters.search"
            placeholder="Search permissions..."
            class="w-full md:w-64"
          >
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton v-if="canCreatePermission" @click="showAddPermissionModal">
          Add Permission
        </VaButton>
      </div>

      <PermissionTable
        :permission="permissions"
        :loading="isLoading"
        :pagination="pagination"
        :can-edit="canEditPermission"
        :can-delete="canDeletePermission"
        v-model:sortBy="sorting.sortBy"
        v-model:sortingOrder="sorting.sortingOrder"
        @edit-permission="showEditPermissionModal"
        @delete-permission="onPermissionDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditPermissionModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">
      {{ permissionToEdit ? "Edit permission" : "Add permission" }}
    </h1>
    <AddPermissionForm
      ref="editFormRef"
      :permission="permissionToEdit"
      :save-button-label="permissionToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (permission) => {
          onPermissionSaved(permission);
          ok();
        }
      "
    />
  </VaModal>
</template>
