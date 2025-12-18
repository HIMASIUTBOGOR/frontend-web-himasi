<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import UsersTable from "./widgets/UsersTable.vue";
import EditUserForm from "./widgets/EditUserForm.vue";
import { User } from "./types";
import { useModal, useToast } from "vuestic-ui";
import { getUsers } from "../../services/user.service";

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
    const response = await getUsers();
    allUsers.value = response.users;
    pagination.value = response.pagination;
  } catch (error: any) {
    notify({
      message: error.message || "Failed to fetch users",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

// Computed filtered users
const users = computed(() => {
  let filtered = [...allUsers.value];

  // Apply search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.nim?.toLowerCase().includes(search)
    );
  }

  // Update pagination total
  pagination.value.total = filtered.length;

  return filtered;
});

// Load users on mount
onMounted(() => {
  fetchUsers();
});

// Watch search filter
watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1; // Reset to first page on search
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

const onUserSaved = async (user: User) => {
  // TODO: Implement user create/update API
  if (userToEdit.value) {
    notify({
      message: `${user.name} has been updated`,
      color: "success",
    });
  } else {
    notify({
      message: `${user.name} has been created`,
      color: "success",
    });
  }

  doShowEditUserModal.value = false;
  await fetchUsers();
};

const onUserDelete = async (user: User) => {
  // TODO: Implement delete API
  notify({
    message: `${user.name} has been deleted`,
    color: "success",
  });

  await fetchUsers();
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
</script>

<template>
  <h1 class="page-title">Users</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <!-- <VaButtonToggle
            v-model="filters.isActive"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ]"
          /> -->
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddUserModal">Add User</VaButton>
      </div>

      <UsersTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :users="users"
        :loading="isLoading"
        :pagination="pagination"
        @editUser="showEditUserModal"
        @deleteUser="onUserDelete"
      />
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
