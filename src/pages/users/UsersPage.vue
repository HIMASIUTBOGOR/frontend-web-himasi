<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import UsersTable from "./widgets/UsersTable.vue";
import EditUserForm from "./widgets/EditUserForm.vue";
import { User } from "./types";
import { useModal, useToast } from "vuestic-ui";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/user.service";
import { usePermissions } from "../../composables/usePermissions";

const doShowEditUserModal = ref(false);
const { init: notify } = useToast();

// State
const allUsers = ref<User[]>([]);
const isLoading = ref(false);
const filters = ref({ isActive: true, search: "" });
const sorting = ref<{ sortBy: any; sortingOrder: any }>({
  sortBy: undefined,
  sortingOrder: null,
});
const pagination = ref({ page: 1, perPage: 10, total: 0 });

// Fetch users from API
const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const response = await getUsers({
      limit: pagination.value.perPage,
      page: pagination.value.page,
      search: filters.value.search,
    });
    allUsers.value = response.users;
    pagination.value.total = response.meta.total;
  } catch (error: any) {
    notify({
      message: error.message || "Failed to fetch users",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

// Return users directly from API (no client-side filtering)
const users = computed(() => {
  return allUsers.value;
});

// Load users on mount
onMounted(() => {
  fetchUsers();
});

// Watch search filter and refetch
watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1; // Reset to first page on search
    fetchUsers();
  }
);

// Watch pagination changes
watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => {
    fetchUsers();
  }
);

const userToEdit = ref<User | null>(null);

const showEditUserModal = (user: User) => {
  userToEdit.value = user;
  doShowEditUserModal.value = true;
};

const showAddUserModal = () => {
  userToEdit.value = null;
  doShowEditUserModal.value = true;
};

const onUserSaved = async (data: { formData: FormData; isEdit: boolean }) => {
  try {
    const userName = data.formData.get("name") as string;

    if (data.isEdit && userToEdit.value) {
      // Update existing user
      console.log(data.formData);
      await updateUser(userToEdit.value.id, data.formData);
      notify({
        message: `${userName} has been updated`,
        color: "success",
      });
    } else {
      // Create new user
      await createUser(data.formData);
      notify({
        message: `${userName} has been created`,
        color: "success",
      });
    }

    doShowEditUserModal.value = false;
    await fetchUsers();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to save user",
      color: "danger",
    });
  }
};

const onUserDelete = async (user: User) => {
  try {
    await deleteUser(user.id);
    notify({
      message: `${user.name} has been deleted`,
      color: "success",
    });
    await fetchUsers();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to delete user",
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
  canCreate: canCreateUser,
  canEdit: canEditUser,
  canDelete: canDeleteUser,
  canView: canViewUser,
} = usePermissions("user");
</script>

<template>
  <h1 class="page-title">Users</h1>

  <VaCard>
    <VaCardContent>
      <div v-if="!canViewUser" class="flex items-center justify-center py-8">
        <VaAlert color="warning" border="top">
          You don't have permission to view this page.
        </VaAlert>
      </div>

      <template v-else>
        <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
          <div class="flex flex-col md:flex-row gap-2 justify-start">
            <VaInput v-model="filters.search" placeholder="Search">
              <template #prependInner>
                <VaIcon name="search" color="secondary" size="small" />
              </template>
            </VaInput>
          </div>

          <VaButton v-if="canCreateUser" @click="showAddUserModal"
            >Add User</VaButton
          >
        </div>

        <UsersTable
          v-model:sort-by="sorting.sortBy"
          v-model:sorting-order="sorting.sortingOrder"
          :users="users"
          :loading="isLoading"
          :pagination="pagination"
          :can-edit="canEditUser"
          :can-delete="canDeleteUser"
          @editUser="showEditUserModal"
          @deleteUser="onUserDelete"
        />
      </template>
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditUserModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ userToEdit ? "Edit user" : "Add user" }}</h1>
    <EditUserForm
      ref="editFormRef"
      :user="userToEdit"
      :save-button-label="userToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (user) => {
          onUserSaved(user);
          ok();
        }
      "
    />
  </VaModal>
</template>
