<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useModal, useToast } from "vuestic-ui";
import { Registration } from "./type";
import {
  deleteFaq,
  getRegistrations,
  exportPdf,
  exportPdfAll,
} from "../../services/registration/registration.service";
import { usePermissions } from "../../composables/usePermissions";
import RegistrationTable from "./widgets/RegistrationTable.vue";
import RegistrationDetailModal from "./widgets/RegistrationDetailModal.vue";

const { init: notify } = useToast();

// State
const allRegistrations = ref<Registration[]>([]);
const isLoading = ref(false);
const filters = ref({ isActive: true, search: "" });
const sorting = ref<{ sortBy: any; sortingOrder: any }>({
  sortBy: undefined,
  sortingOrder: null,
});
const pagination = ref({ page: 1, perPage: 10, total: 0 });
const selectedRegistration = ref<Registration | null>(null);
const showDetailModal = ref(false);
const isExporting = ref(false);

// Fetch registrations from API
const fetchRegistrations = async () => {
  try {
    isLoading.value = true;
    const response = await getRegistrations({
      limit: pagination.value.perPage,
      page: pagination.value.page,
      search: filters.value.search,
    });
    allRegistrations.value = response.registration;
    pagination.value.total = response.meta.total;
  } catch (error: any) {
    notify({
      message: error.message || "Failed to fetch registrations",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

const registrations = computed(() => {
  return allRegistrations.value;
});

onMounted(() => {
  fetchRegistrations();
});

watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1;
    fetchRegistrations();
  }
);

watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => {
    fetchRegistrations();
  }
);

const onRegistrationDelete = async (registration: Registration) => {
  try {
    await deleteFaq(registration.id);
    notify({
      message: `Registration for ${registration.fullname} has been deleted`,
      color: "success",
    });
    await fetchRegistrations();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to delete registration",
      color: "danger",
    });
  }
};

const onViewDetail = (registration: Registration) => {
  selectedRegistration.value = registration;
  showDetailModal.value = true;
};

const onExportPdf = async (registration: Registration) => {
  try {
    isExporting.value = true;
    await exportPdf(registration.id);
    notify({
      message: `PDF for ${registration.fullname} has been exported`,
      color: "success",
    });
  } catch (error: any) {
    notify({
      message: error.message || "Failed to export PDF",
      color: "danger",
    });
  } finally {
    isExporting.value = false;
  }
};

const onExportPdfAll = async () => {
  try {
    isExporting.value = true;
    await exportPdfAll();
    notify({
      message: "All registrations have been exported to PDF",
      color: "success",
    });
  } catch (error: any) {
    notify({
      message: error.message || "Failed to export all PDFs",
      color: "danger",
    });
  } finally {
    isExporting.value = false;
  }
};

const { confirm } = useModal();

const {
  canDelete: canDeleteRegistration,
  canView: canViewRegistration,
  hasPermission: hasPermissionRegistration,
} = usePermissions("registration");

const canExportPdf = computed(() =>
  hasPermissionRegistration("registration.exportPdf")
);
const canExportPdfAll = computed(() =>
  hasPermissionRegistration("registration.exportPdfAll")
);
</script>

<template>
  <h1 class="page-title">Registration Page</h1>

  <VaCard>
    <VaCardContent>
      <div
        v-if="!canViewRegistration"
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
              placeholder="Search by name or NIM..."
              class="w-full md:w-64"
            >
              <template #prependInner>
                <VaIcon name="search" color="secondary" size="small" />
              </template>
            </VaInput>
          </div>
          <VaButton
            v-if="canExportPdfAll"
            icon="mso-download"
            :loading="isExporting"
            :disabled="isExporting || registrations.length === 0"
            @click="onExportPdfAll"
          >
            Export All to PDF
          </VaButton>
        </div>

        <RegistrationTable
          :registrations="registrations"
          :loading="isLoading"
          :pagination="pagination"
          :can-delete="canDeleteRegistration"
          :can-export-pdf="canExportPdf"
          v-model:sortBy="sorting.sortBy"
          v-model:sortingOrder="sorting.sortingOrder"
          @view-detail="onViewDetail"
          @delete-registration="onRegistrationDelete"
          @export-pdf="onExportPdf"
        />
      </template>
    </VaCardContent>
  </VaCard>

  <RegistrationDetailModal
    v-model="showDetailModal"
    :registration="selectedRegistration"
    @export-pdf="onExportPdf"
  />
</template>
