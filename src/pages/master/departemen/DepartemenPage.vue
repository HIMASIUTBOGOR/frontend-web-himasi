<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { usePermissions } from "../../../composables/usePermissions";
import DepartemenTable from "./widgets/DepartemenTable.vue";
import { useModal, useToast } from "vuestic-ui";
import { Departemen } from "./type";

import FormDepartemen from "./widgets/FormDepartemen.vue";
import { payloadDepartemen } from "../../../interfaces/IMaster";
import {
  createDepartemen,
  deleteDepartemen,
  getDepartemens,
  updateDepartemen,
} from "../../../services/cms/departement.service";
const doShowEditPermissionModal = ref(false);
const { init: notify } = useToast();

// State
const allDepartemens = ref<Departemen[]>([]);
const isLoading = ref(false);
const filters = ref({ isActive: true, search: "" });
const sorting = ref<{ sortBy: any; sortingOrder: any }>({
  sortBy: undefined,
  sortingOrder: null,
});
const pagination = ref({ page: 1, perPage: 10, total: 0 });

// Fetch activities from API
const fetchDepartemens = async () => {
  try {
    isLoading.value = true;
    const response = await getDepartemens({
      limit: pagination.value.perPage,
      page: pagination.value.page,
      search: filters.value.search,
    });
    allDepartemens.value = response.departments;
    pagination.value.total = response.meta.total;
  } catch (error: any) {
    notify({
      message: error.message || "Failed to fetch departemens",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

const departemens = computed(() => {
  return allDepartemens.value;
});

onMounted(() => {
  fetchDepartemens();
});

watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1;
    fetchDepartemens();
  }
);

watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => {
    fetchDepartemens();
  }
);

const departemenToEdit = ref<Departemen | null>(null);
const showEditDepartemenModal = (departemen: Departemen) => {
  departemenToEdit.value = departemen;
  doShowEditPermissionModal.value = true;
};

const showAddDepartemenModal = () => {
  departemenToEdit.value = null;
  doShowEditPermissionModal.value = true;
};

const onDepartemenSaved = async (departemenData: payloadDepartemen) => {
  try {
    if (departemenToEdit.value) {
      // Update existing departemen
      await updateDepartemen(departemenToEdit.value.id, departemenData);
      notify({
        message: `${departemenData.title} has been updated`,
        color: "success",
      });
    } else {
      // Create new departemen
      await createDepartemen(departemenData);
      notify({
        message: `${departemenData.title} has been created`,
        color: "success",
      });
    }

    doShowEditPermissionModal.value = false;
    await fetchDepartemens();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to save departemen",
      color: "danger",
    });
  }
};

const onDepartemenDelete = async (departemen: Departemen) => {
  try {
    await deleteDepartemen(departemen.id);
    notify({
      message: `${departemen.title} has been deleted`,
      color: "success",
    });
    await fetchDepartemens();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to delete departemen",
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

const {
  canCreate: canCreateDepartemen,
  canEdit: canEditDepartemen,
  canDelete: canDeleteDepartemen,
  canView: canViewDepartemen,
} = usePermissions("cms.departemen");
</script>

<template>
  <h1 class="page-title">Departemen</h1>
  <VaCard>
    <VaCardContent>
      <div
        v-if="!canViewDepartemen"
        class="flex items-center justify-center py-8"
      >
        <VaAlert color="warning" border="top">
          You don't have permission to view this page.
        </VaAlert>
      </div>

      <template v-else>
        <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
          <div class="flex flex-col md:flex-row gap-2 justify-start">
            <VaInput
              v-model="filters.search"
              placeholder="Search activity..."
              class="w-full md:w-64"
            >
              <template #prependInner>
                <VaIcon name="search" color="secondary" size="small" />
              </template>
            </VaInput>
          </div>
          <VaButton v-if="canCreateDepartemen" @click="showAddDepartemenModal">
            Add Departemen
          </VaButton>
        </div>

        <DepartemenTable
          :departemen="departemens"
          :loading="isLoading"
          :pagination="pagination"
          :can-edit="canEditDepartemen"
          :can-delete="canDeleteDepartemen"
          v-model:sortBy="sorting.sortBy"
          v-model:sortingOrder="sorting.sortingOrder"
          @edit-departemen="showEditDepartemenModal"
          @delete-departemen="onDepartemenDelete"
        />
      </template>
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
      {{ departemenToEdit ? "Edit departemen" : "Add departemen" }}
    </h1>
    <FormDepartemen
      ref="editFormRef"
      :departemen="departemenToEdit"
      :save-button-label="departemenToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (departemen) => {
          onDepartemenSaved(departemen).then(() => {
            ok();
          });
        }
      "
    />
  </VaModal>
</template>
