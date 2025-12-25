<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { usePermissions } from "../../../composables/usePermissions";
import EnumerationTable from "./widgets/EnumerationTable.vue";
import { useModal, useToast } from "vuestic-ui";
import { Enumeration } from "./type";
import {
  createEnumeration,
  deleteEnumeration,
  getEnumerations,
  updateEnumeration,
} from "../../../services/enumeration.service";
import FormEnumeration from "./widgets/FormEnumeration.vue";
import { payloadEnumeration } from "../../../interfaces/IMaster";
const doShowEditPermissionModal = ref(false);
const { init: notify } = useToast();

// State
const allEnumerations = ref<Enumeration[]>([]);
const isLoading = ref(false);
const filters = ref({ isActive: true, search: "" });
const sorting = ref<{ sortBy: any; sortingOrder: any }>({
  sortBy: undefined,
  sortingOrder: null,
});
const pagination = ref({ page: 1, perPage: 10, total: 0 });

// Fetch activities from API
const fetchEnumerations = async () => {
  try {
    isLoading.value = true;
    const response = await getEnumerations({
      limit: pagination.value.perPage,
      page: pagination.value.page,
      search: filters.value.search,
    });
    allEnumerations.value = response.enumerations;
    pagination.value.total = response.meta.total;
  } catch (error: any) {
    notify({
      message: error.message || "Failed to fetch enumerations",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

const enumerations = computed(() => {
  return allEnumerations.value;
});

onMounted(() => {
  fetchEnumerations();
});

watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1;
    fetchEnumerations();
  }
);

watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => {
    fetchEnumerations();
  }
);

const enumerationToEdit = ref<Enumeration | null>(null);
const showEditEnumerationModal = (enumeration: Enumeration) => {
  enumerationToEdit.value = enumeration;
  doShowEditPermissionModal.value = true;
};

const showAddEnumerationModal = () => {
  enumerationToEdit.value = null;
  doShowEditPermissionModal.value = true;
};

const onEnumerationSaved = async (enumerationData: payloadEnumeration) => {
  try {
    if (enumerationToEdit.value) {
      // Update existing enumeration
      await updateEnumeration(enumerationToEdit.value.id, enumerationData);
      notify({
        message: `${enumerationData.value} has been updated`,
        color: "success",
      });
    } else {
      // Create new enumeration
      await createEnumeration(enumerationData);
      notify({
        message: `${enumerationData.value} has been created`,
        color: "success",
      });
    }

    doShowEditPermissionModal.value = false;
    await fetchEnumerations();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to save enumeration",
      color: "danger",
    });
  }
};

const onEnumerationDelete = async (enumeration: Enumeration) => {
  try {
    await deleteEnumeration(enumeration.id);
    notify({
      message: `${enumeration.value} has been deleted`,
      color: "success",
    });
    await fetchEnumerations();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to delete enumeration",
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
  canCreate: canCreateEnumeration,
  canEdit: canEditEnumeration,
  canDelete: canDeleteEnumeration,
  canView: canViewEnumeration,
} = usePermissions("enumeration");
</script>

<template>
  <h1 class="page-title">Enumeration Page</h1>
  <VaCard>
    <VaCardContent>
      <div
        v-if="!canViewEnumeration"
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
          <VaButton
            v-if="canCreateEnumeration"
            @click="showAddEnumerationModal"
          >
            Add Enumeration
          </VaButton>
        </div>

        <EnumerationTable
          :enumeration="enumerations"
          :loading="isLoading"
          :pagination="pagination"
          :can-edit="canEditEnumeration"
          :can-delete="canDeleteEnumeration"
          v-model:sortBy="sorting.sortBy"
          v-model:sortingOrder="sorting.sortingOrder"
          @edit-enumeration="showEditEnumerationModal"
          @delete-enumeration="onEnumerationDelete"
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
      {{ enumerationToEdit ? "Edit enumeration" : "Add enumeration" }}
    </h1>
    <FormEnumeration
      ref="editFormRef"
      :enumeration="enumerationToEdit"
      :save-button-label="enumerationToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (enumeration) => {
          onEnumerationSaved(enumeration).then(() => {
            ok();
          });
        }
      "
    />
  </VaModal>
</template>
