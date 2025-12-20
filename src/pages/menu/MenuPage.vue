<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useModal, useToast } from "vuestic-ui";
import {
  deleteMenu,
  updateMenu,
  createMenu,
  getMenu,
} from "../../services/user.service";
import MenuTable from "./widgets/MenuTable.vue";
import { Menu } from "./type";
import { usePermissions } from "../../composables/usePermissions";
import { payloadMenu } from "../../interfaces/IUser";
import FormMenu from "./widgets/FormMenu.vue";

const doShowEditMenuModal = ref(false);
const { init: notify } = useToast();

// State
const allMenus = ref<Menu[]>([]);
const isLoading = ref(false);
const filters = ref({ isActive: true, search: "" });
const sorting = ref<{ sortBy: any; sortingOrder: any }>({
  sortBy: undefined,
  sortingOrder: null,
});
const pagination = ref({ page: 1, perPage: 10, total: 0 });

// Fetch menus from API
const fetchMenus = async () => {
  try {
    isLoading.value = true;
    const response = await getMenu({
      limit: pagination.value.perPage,
      page: pagination.value.page,
      search: filters.value.search,
    });
    allMenus.value = response.menu;
    pagination.value.total = response.meta.total;
  } catch (error: any) {
    notify({
      message: error.message || "Failed to fetch menus",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

// Return menus directly from API (no client-side filtering)
const menus = computed(() => {
  return allMenus.value;
});

// Load menus on mount
onMounted(() => {
  fetchMenus();
});

// Watch search filter and refetch
watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1; // Reset to first page on search
    fetchMenus();
  }
);

// Watch pagination changes
watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => {
    fetchMenus();
  }
);

const menuToEdit = ref<Menu | null>(null);
const showEditMenuModal = (menu: Menu) => {
  menuToEdit.value = menu;
  doShowEditMenuModal.value = true;
};

const showAddMenuModal = () => {
  menuToEdit.value = null;
  doShowEditMenuModal.value = true;
};

const onMenuSaved = async (menuData: payloadMenu) => {
  try {
    if (menuToEdit.value) {
      // Update existing menu
      if (!menuToEdit.value.id) {
        throw new Error("Invalid menu ID");
      }
      await updateMenu(menuToEdit.value.id, menuData);
      notify({
        message: `${menuData.name} has been updated`,
        color: "success",
      });
    } else {
      // Create new menu
      await createMenu(menuData);
      notify({
        message: `${menuData.name} has been created`,
        color: "success",
      });
    }

    doShowEditMenuModal.value = false;
    await fetchMenus();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to save menu",
      color: "danger",
    });
  }
};

const onMenuDelete = async (menu: Menu) => {
  try {
    if (!menu.id) {
      throw new Error("Invalid menu ID");
    }
    await deleteMenu(menu.id);
    notify({
      message: `${menu.name} has been deleted`,
      color: "success",
    });
    await fetchMenus();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to delete menu",
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
  canCreate: canCreateMenu,
  canEdit: canEditMenu,
  canDelete: canDeleteMenu,
  canView: canViewMenu,
} = usePermissions("menu");
</script>

<template>
  <h1 class="page-title">Menu Page</h1>
  <VaCard>
    <VaCardContent>
      <div v-if="!canViewMenu" class="flex items-center justify-center py-8">
        <VaAlert color="warning" border="top">
          You don't have permission to view this page.
        </VaAlert>
      </div>

      <template v-else>
        <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
          <div class="flex flex-col md:flex-row gap-2 justify-start">
            <VaInput
              v-model="filters.search"
              placeholder="Search menus..."
              class="w-full md:w-64"
            >
              <template #prependInner>
                <VaIcon name="search" color="secondary" size="small" />
              </template>
            </VaInput>
          </div>
          <VaButton v-if="canCreateMenu" @click="showAddMenuModal">
            Add Menu
          </VaButton>
        </div>

        <MenuTable
          :menu="menus"
          :loading="isLoading"
          :pagination="pagination"
          :can-edit="canEditMenu"
          :can-delete="canDeleteMenu"
          v-model:sortBy="sorting.sortBy"
          v-model:sortingOrder="sorting.sortingOrder"
          @edit-menu="showEditMenuModal"
          @delete-menu="onMenuDelete"
        />
      </template>
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditMenuModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">
      {{ menuToEdit ? "Edit menu" : "Add menu" }}
    </h1>
    <FormMenu
      ref="editFormRef"
      :menu="menuToEdit"
      :save-button-label="menuToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (menu) => {
          onMenuSaved(menu);
          ok();
        }
      "
    />
  </VaModal>
</template>
