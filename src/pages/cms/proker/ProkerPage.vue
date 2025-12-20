<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { usePermissions } from "../../../composables/usePermissions";
import ProkerTable from "./widgets/ProkerTable.vue";
import { useModal, useToast } from "vuestic-ui";
import { Proker } from "./type";

import FormProker from "./widgets/FormProker.vue";
import { payloadProker } from "../../../interfaces/IMaster";
import {
  createProker,
  deleteProker,
  getProkers,
  updateProker,
} from "../../../services/cms/proker.service";
import { f } from "vue-router/dist/router-CWoNjPRp.mjs";
const doShowEditProkerModal = ref(false);
const { init: notify } = useToast();

// State
const allProkers = ref<Proker[]>([]);
const isLoading = ref(false);
const filters = ref({ isActive: true, search: "" });
const sorting = ref<{ sortBy: any; sortingOrder: any }>({
  sortBy: undefined,
  sortingOrder: null,
});
const pagination = ref({ page: 1, perPage: 10, total: 0 });

// Fetch activities from API
const fetchProkers = async () => {
  try {
    isLoading.value = true;
    const response = await getProkers({
      limit: pagination.value.perPage,
      page: pagination.value.page,
      search: filters.value.search,
    });
    allProkers.value = response.proker;
    pagination.value.total = response.meta.total;
  } catch (error: any) {
    notify({
      message: error.message || "Failed to fetch prokers",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

const prokers = computed(() => {
  return allProkers.value;
});

onMounted(() => {
  fetchProkers();
});

watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1;
    fetchProkers();
  }
);

watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => {
    fetchProkers();
  }
);

const prokerToEdit = ref<Proker | null>(null);
const showEditProkerModal = (proker: Proker) => {
  prokerToEdit.value = proker;
  doShowEditProkerModal.value = true;
};

const showAddProkerModal = () => {
  prokerToEdit.value = null;
  doShowEditProkerModal.value = true;
};

const onProkerSaved = async (prokerData: payloadProker) => {
  try {
    if (prokerToEdit.value) {
      // Update existing proker
      await updateProker(prokerToEdit.value.id, prokerData);
      notify({
        message: `${prokerData.title} has been updated`,
        color: "success",
      });
    } else {
      // Create new proker
      await createProker(prokerData);
      notify({
        message: `${prokerData.title} has been created`,
        color: "success",
      });
    }

    doShowEditProkerModal.value = false;
    await fetchProkers();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to save proker",
      color: "danger",
    });
  }
};

const onProkerDelete = async (proker: Proker) => {
  try {
    await deleteProker(proker.id);
    notify({
      message: `${proker.title} has been deleted`,
      color: "success",
    });
    await fetchProkers();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to delete proker",
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
  canCreate: canCreateProker,
  canEdit: canEditProker,
  canDelete: canDeleteProker,
  canView: canViewProker,
} = usePermissions("cms.proker");
</script>

<template>
  <h1 class="page-title">Proker</h1>
  <VaCard>
    <VaCardContent>
      <div v-if="!canViewProker" class="flex items-center justify-center py-8">
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
          <VaButton v-if="canCreateProker" @click="showAddProkerModal">
            Add Proker
          </VaButton>
        </div>

        <ProkerTable
          :proker="prokers"
          :loading="isLoading"
          :pagination="pagination"
          :can-edit="canEditProker"
          :can-delete="canDeleteProker"
          v-model:sortBy="sorting.sortBy"
          v-model:sortingOrder="sorting.sortingOrder"
          @edit-proker="showEditProkerModal"
          @delete-proker="onProkerDelete"
        />
      </template>
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditProkerModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">
      {{ prokerToEdit ? "Edit proker" : "Add proker" }}
    </h1>
    <FormProker
      ref="editFormRef"
      :proker="prokerToEdit"
      :save-button-label="prokerToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (proker) => {
          onProkerSaved(proker).then(() => {
            ok();
          });
        }
      "
    />
  </VaModal>
</template>
