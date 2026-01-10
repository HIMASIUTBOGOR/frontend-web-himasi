<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from "vuestic-ui";
import { PropType, computed, toRef } from "vue";
import { Pagination, Sorting } from "../../../data/pages/users";
import { useVModel } from "@vueuse/core";
import { Registration } from "../type";

const columns = defineVaDataTableColumns([
  { label: "No", key: "number", sortable: false },
  { label: "Full Name", key: "fullname", sortable: true },
  { label: "NIM", key: "nim", sortable: true },
  { label: "Semester", key: "semester", sortable: true },
  { label: "WhatsApp", key: "no_wa", sortable: false },
  { label: "Department", key: "department_name", sortable: false },
  { label: "Date", key: "created_at", sortable: true },
  { label: " ", key: "actions", align: "right" },
]);

const props = defineProps({
  registrations: {
    type: Array as PropType<Registration[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting["sortBy"]>, required: true },
  sortingOrder: {
    type: String as PropType<Sorting["sortingOrder"]>,
    default: null,
  },
  canDelete: { type: Boolean, default: false },
  canExportPdf: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (event: "view-detail", registration: Registration): void;
  (event: "delete-registration", registration: Registration): void;
  (event: "export-pdf", registration: Registration): void;
  (event: "update:sortBy", sortBy: Sorting["sortBy"]): void;
  (event: "update:sortingOrder", sortingOrder: Sorting["sortingOrder"]): void;
}>();

const registrations = toRef(props, "registrations");
const sortByVModel = useVModel(props, "sortBy", emit);
const sortingOrderVModel = useVModel(props, "sortingOrder", emit);

const totalPages = computed(() =>
  Math.ceil(props.pagination.total / props.pagination.perPage)
);

const { confirm } = useModal();

const onDeleteRegistration = async (registration: Registration) => {
  const agreed = await confirm({
    title: "Delete Registration",
    message: `Are you sure you want to delete registration for ${registration.fullname}?`,
    okText: "Delete",
    cancelText: "Cancel",
    size: "small",
    maxWidth: "380px",
  });

  if (agreed) {
    if (registration.id) {
      emit("delete-registration", registration);
    } else {
      console.error("Registration ID is invalid", registration);
    }
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getRowNumber = (index: number) => {
  return (props.pagination.page - 1) * props.pagination.perPage + index + 1;
};
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="registrations"
    :loading="$props.loading"
  >
    <template #cell(number)="{ rowIndex }">
      <div class="flex items-center gap-2">
        {{ getRowNumber(rowIndex) }}
      </div>
    </template>

    <template #cell(fullname)="{ rowData }">
      <div class="ellipsis max-w-[200px]">
        {{ rowData.fullname }}
      </div>
    </template>

    <template #cell(nim)="{ rowData }">
      <div class="ellipsis max-w-[120px]">
        {{ rowData.nim }}
      </div>
    </template>

    <template #cell(semester)="{ rowData }">
      <div class="text-center">
        {{ rowData.semester }}
      </div>
    </template>

    <template #cell(no_wa)="{ rowData }">
      <div class="ellipsis max-w-[130px]">
        {{ rowData.no_wa }}
      </div>
    </template>

    <template #cell(department_name)="{ rowData }">
      <div class="ellipsis max-w-[150px]">
        {{ rowData.department_name || "-" }}
      </div>
    </template>

    <template #cell(created_at)="{ rowData }">
      <div class="ellipsis max-w-[120px]">
        {{ formatDate(rowData.created_at) }}
      </div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-visibility"
          aria-label="View detail"
          @click="$emit('view-detail', rowData as Registration)"
        />
        <VaButton
          v-if="canExportPdf"
          preset="primary"
          size="small"
          icon="mso-download"
          color="primary"
          aria-label="Export PDF"
          @click="$emit('export-pdf', rowData as Registration)"
        />
        <VaButton
          v-if="canDelete"
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete registration"
          @click="onDeleteRegistration(rowData as Registration)"
        />
      </div>
    </template>
  </VaDataTable>

  <div
    class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2"
  >
    <div>
      <b>{{ $props.pagination.total }} results.</b>
      Results per page
      <VaSelect
        v-model="$props.pagination.perPage"
        class="!w-20"
        :options="[10, 50, 100]"
      />
    </div>

    <div v-if="totalPages > 1" class="flex">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        aria-label="Previous page"
        :disabled="$props.pagination.page === 1"
        @click="$props.pagination.page--"
      />
      <VaButton
        class="mr-2"
        preset="secondary"
        icon="va-arrow-right"
        aria-label="Next page"
        :disabled="$props.pagination.page === totalPages"
        @click="$props.pagination.page++"
      />
      <VaPagination
        v-model="$props.pagination.page"
        buttons-preset="secondary"
        :pages="totalPages"
        :visible-pages="5"
        :boundary-links="false"
        :direction-links="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
