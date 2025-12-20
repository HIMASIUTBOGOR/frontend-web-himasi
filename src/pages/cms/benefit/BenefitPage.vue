<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { usePermissions } from "../../../composables/usePermissions";
import BenefitTable from "./widgets/BenefitTable.vue";
import { useModal, useToast } from "vuestic-ui";
import { Benefit } from "./type";
import {
  createBenefit,
  deleteBenefit,
  getBenefits,
  updateBenefit,
} from "../../../services/cms/benefit.service";
import FormBenefit from "./widgets/FormBenefit.vue";
import { payloadBenefit } from "../../../interfaces/ICms";
const doShowEditPermissionModal = ref(false);
const { init: notify } = useToast();

// State
const allBenefits = ref<Benefit[]>([]);
const isLoading = ref(false);
const filters = ref({ isActive: true, search: "" });
const sorting = ref<{ sortBy: any; sortingOrder: any }>({
  sortBy: undefined,
  sortingOrder: null,
});
const pagination = ref({ page: 1, perPage: 10, total: 0 });

// Fetch activities from API
const fetchBenefits = async () => {
  try {
    isLoading.value = true;
    const response = await getBenefits({
      limit: pagination.value.perPage,
      page: pagination.value.page,
      search: filters.value.search,
    });
    allBenefits.value = response.benefits;
    pagination.value.total = response.meta.total;
  } catch (error: any) {
    notify({
      message: error.message || "Failed to fetch benefits",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

const benefits = computed(() => {
  return allBenefits.value;
});

onMounted(() => {
  fetchBenefits();
});

watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1;
    fetchBenefits();
  }
);

watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => {
    fetchBenefits();
  }
);

const benefitToEdit = ref<Benefit | null>(null);
const showEditBenefitModal = (benefit: Benefit) => {
  benefitToEdit.value = benefit;
  doShowEditPermissionModal.value = true;
};

const showAddBenefitModal = () => {
  benefitToEdit.value = null;
  doShowEditPermissionModal.value = true;
};

const onBenefitSaved = async (benefitData: payloadBenefit) => {
  try {
    if (benefitToEdit.value) {
      // Update existing benefit
      await updateBenefit(benefitToEdit.value.id, benefitData);
      notify({
        message: `${benefitData.title} has been updated`,
        color: "success",
      });
    } else {
      // Create new benefit
      await createBenefit(benefitData);
      notify({
        message: `${benefitData.title} has been created`,
        color: "success",
      });
    }

    doShowEditPermissionModal.value = false;
    await fetchBenefits();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to save benefit",
      color: "danger",
    });
  }
};

const onBenefitDelete = async (benefit: Benefit) => {
  try {
    await deleteBenefit(benefit.id);
    notify({
      message: `${benefit.title} has been deleted`,
      color: "success",
    });
    await fetchBenefits();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to delete benefit",
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
  canCreate: canCreateBenefit,
  canEdit: canEditBenefit,
  canDelete: canDeleteBenefit,
  canView: canViewBenefit,
} = usePermissions("cms.benefit");
</script>

<template>
  <h1 class="page-title">Benefit Page</h1>
  <VaCard>
    <VaCardContent>
      <div v-if="!canViewBenefit" class="flex items-center justify-center py-8">
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
          <VaButton v-if="canCreateBenefit" @click="showAddBenefitModal">
            Add Benefit
          </VaButton>
        </div>

        <BenefitTable
          :benefit="benefits"
          :loading="isLoading"
          :pagination="pagination"
          :can-edit="canEditBenefit"
          :can-delete="canDeleteBenefit"
          v-model:sortBy="sorting.sortBy"
          v-model:sortingOrder="sorting.sortingOrder"
          @edit-benefit="showEditBenefitModal"
          @delete-benefit="onBenefitDelete"
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
      {{ benefitToEdit ? "Edit benefit" : "Add benefit" }}
    </h1>
    <FormBenefit
      ref="editFormRef"
      :benefit="benefitToEdit"
      :save-button-label="benefitToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (benefit) => {
          onBenefitSaved(benefit).then(() => {
            ok();
          });
        }
      "
    />
  </VaModal>
</template>
