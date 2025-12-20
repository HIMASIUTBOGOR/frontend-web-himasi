<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { usePermissions } from "../../../composables/usePermissions";
import ActivityTable from "./widgets/ActivityTable.vue";
import { useModal, useToast } from "vuestic-ui";
import { Activity } from "./type";
import {
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from "../../../services/cms/activity.service";
import FormActivity from "./widgets/FormActivity.vue";
import { payloiadActivity } from "../../../interfaces/ICms";

const doShowEditPermissionModal = ref(false);
const { init: notify } = useToast();

// State
const allActivities = ref<Activity[]>([]);
const isLoading = ref(false);
const filters = ref({ isActive: true, search: "" });
const sorting = ref<{ sortBy: any; sortingOrder: any }>({
  sortBy: undefined,
  sortingOrder: null,
});
const pagination = ref({ page: 1, perPage: 10, total: 0 });

// Fetch activities from API
const fetchActivities = async () => {
  try {
    isLoading.value = true;
    const response = await getActivities({
      limit: pagination.value.perPage,
      page: pagination.value.page,
      search: filters.value.search,
    });
    allActivities.value = response.activities;
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

const activities = computed(() => {
  return allActivities.value;
});

onMounted(() => {
  fetchActivities();
});

watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1;
    fetchActivities();
  }
);

watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => {
    fetchActivities();
  }
);

const activityToEdit = ref<Activity | null>(null);
const showEditActivityModal = (activity: Activity) => {
  activityToEdit.value = activity;
  doShowEditPermissionModal.value = true;
};

const showAddActivityModal = () => {
  activityToEdit.value = null;
  doShowEditPermissionModal.value = true;
};

const onActivitySaved = async (activityData: payloiadActivity) => {
  try {
    if (activityToEdit.value) {
      // Update existing activity
      await updateActivity(activityToEdit.value.id, activityData);
      notify({
        message: `${activityData.desc} has been updated`,
        color: "success",
      });
    } else {
      // Create new activity
      await createActivity(activityData);
      notify({
        message: `${activityData.desc} has been created`,
        color: "success",
      });
    }

    doShowEditPermissionModal.value = false;
    await fetchActivities();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to save activity",
      color: "danger",
    });
  }
};

const onActivityDelete = async (activity: Activity) => {
  try {
    await deleteActivity(activity.id);
    notify({
      message: `${activity.desc} has been deleted`,
      color: "success",
    });
    await fetchActivities();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to delete activity",
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
  canCreate: canCreateActivity,
  canEdit: canEditActivity,
  canDelete: canDeleteActivity,
  canView: canViewActivity,
} = usePermissions("cms.activity");
</script>

<template>
  <h1 class="page-title">Activity Page</h1>

  <VaCard>
    <VaCardContent>
      <div
        v-if="!canViewActivity"
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
          <VaButton v-if="canCreateActivity" @click="showAddActivityModal">
            Add Activity
          </VaButton>
        </div>

        <ActivityTable
          :activity="activities"
          :loading="isLoading"
          :pagination="pagination"
          :can-edit="canEditActivity"
          :can-delete="canDeleteActivity"
          v-model:sortBy="sorting.sortBy"
          v-model:sortingOrder="sorting.sortingOrder"
          @edit-activity="showEditActivityModal"
          @delete-activity="onActivityDelete"
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
      {{ activityToEdit ? "Edit activity" : "Add activity" }}
    </h1>
    <FormActivity
      ref="editFormRef"
      :activity="activityToEdit"
      :save-button-label="activityToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (activity) => {
          onActivitySaved(activity);
          ok();
        }
      "
    />
  </VaModal>
</template>
