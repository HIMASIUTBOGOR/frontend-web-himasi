<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { usePermissions } from "../../../composables/usePermissions";
import FaqTable from "./widgets/FaqTable.vue";
import { useModal, useToast } from "vuestic-ui";
import { Faq } from "./type";
import {
  createFaq,
  deleteFaq,
  getFaq,
  updateFaq,
} from "../../../services/cms/faq.service";
import FormFaq from "./widgets/FormFaq.vue";
import { payloadFaq } from "../../../interfaces/ICms";

const doShowEditFaqModal = ref(false);
const { init: notify } = useToast();

// State
const allFaqs = ref<Faq[]>([]);
const isLoading = ref(false);
const filters = ref({ isActive: true, search: "" });
const sorting = ref<{ sortBy: any; sortingOrder: any }>({
  sortBy: undefined,
  sortingOrder: null,
});
const pagination = ref({ page: 1, perPage: 10, total: 0 });

// Fetch faqs from API
const fetchFaq = async () => {
  try {
    isLoading.value = true;
    const response = await getFaq({
      limit: pagination.value.perPage,
      page: pagination.value.page,
      search: filters.value.search,
    });
    allFaqs.value = response.faqs;
    pagination.value.total = response.meta.total;
  } catch (error: any) {
    notify({
      message: error.message || "Failed to fetch faqs",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

const faqs = computed(() => {
  return allFaqs.value;
});

onMounted(() => {
  fetchFaq();
});

watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1;
    fetchFaq();
  }
);

watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => {
    fetchFaq();
  }
);

const faqToEdit = ref<Faq | null>(null);
const showEditFaqModal = (faq: Faq) => {
  faqToEdit.value = faq;
  doShowEditFaqModal.value = true;
};

const showAddFaqModal = () => {
  faqToEdit.value = null;
  doShowEditFaqModal.value = true;
};

const onFaqSaved = async (faqData: payloadFaq) => {
  try {
    if (faqToEdit.value) {
      // Update existing faq
      await updateFaq(faqToEdit.value.id, faqData);
      notify({
        message: `${faqData.title} has been updated`,
        color: "success",
      });
    } else {
      // Create new faq
      await createFaq(faqData);
      notify({
        message: `${faqData.title} has been created`,
        color: "success",
      });
    }

    doShowEditFaqModal.value = false;
    await fetchFaq();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to save faq",
      color: "danger",
    });
  }
};

const onFaqDelete = async (faq: Faq) => {
  try {
    await deleteFaq(faq.id);
    notify({
      message: `${faq.title} has been deleted`,
      color: "success",
    });
    await fetchFaq();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to delete faq",
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
  canCreate: canCreateFaq,
  canEdit: canEditFaq,
  canDelete: canDeleteFaq,
  canView: canViewFaq,
} = usePermissions("cms.faq");
</script>

<template>
  <h1 class="page-title">Faq Page</h1>

  <VaCard>
    <VaCardContent>
      <div v-if="!canViewFaq" class="flex items-center justify-center py-8">
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
          <VaButton v-if="canCreateFaq" @click="showAddFaqModal">
            Add Faq
          </VaButton>
        </div>

        <FaqTable
          :faq="faqs"
          :loading="isLoading"
          :pagination="pagination"
          :can-edit="canEditFaq"
          :can-delete="canDeleteFaq"
          v-model:sortBy="sorting.sortBy"
          v-model:sortingOrder="sorting.sortingOrder"
          @edit-faq="showEditFaqModal"
          @delete-faq="onFaqDelete"
        />
      </template>
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditFaqModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">
      {{ faqToEdit ? "Edit faq" : "Add faq" }}
    </h1>
    <FormFaq
      ref="editFormRef"
      :faq="faqToEdit"
      :save-button-label="faqToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (faq) => {
          onFaqSaved(faq);
          ok();
        }
      "
    />
  </VaModal>
</template>
